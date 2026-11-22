import { spawnSync } from 'node:child_process';
import { access, cp, mkdir, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

/** Remove a source copy left by an interrupted strict-check batch. */
async function removeSourceCopies(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules') continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await removeSourceCopies(path);
    else if (/\.tsx?$/.test(entry.name) && !entry.name.endsWith('.d.ts')) await rm(path);
  }
}

/** Check whether a completed provisional snapshot can be resumed. */
async function snapshotExists(workspace) {
  try {
    await access(join(workspace, 'snapshot.ready'));
    await access(join(workspace, 'check'));
    await access(join(workspace, 'output'));
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

/** Run a bounded unchecked emit used only as strict-check dependency input. */
function emitSnapshot(projectRoot, snapshotRoot, memoryMiB) {
  const compiler = join(projectRoot, 'node_modules/typescript/bin/tsc');
  const result = spawnSync(
    process.execPath,
    [
      `--max-old-space-size=${memoryMiB}`,
      compiler,
      '-p',
      join(projectRoot, 'tsconfig.build.json'),
      '--noCheck',
      '--outDir',
      snapshotRoot,
    ],
    { cwd: projectRoot, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, timeout: 120_000 },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Provisional declaration emit failed:\n${result.stdout}\n${result.stderr}`);
  }
}

/** Prepare declaration dependencies without publishing unchecked output. */
export async function prepareDeclarationSnapshot(projectRoot, workspace, memoryMiB) {
  const checkRoot = join(workspace, 'check');
  const outputRoot = join(workspace, 'output');
  if (await snapshotExists(workspace)) {
    await removeSourceCopies(checkRoot);
    return { checkRoot, outputRoot };
  }

  const snapshotRoot = join(workspace, 'snapshot');
  await rm(snapshotRoot, { recursive: true, force: true });
  await rm(checkRoot, { recursive: true, force: true });
  await rm(outputRoot, { recursive: true, force: true });
  emitSnapshot(projectRoot, snapshotRoot, memoryMiB);
  await cp(snapshotRoot, checkRoot, { recursive: true });
  await cp(snapshotRoot, outputRoot, { recursive: true });
  await rm(join(workspace, 'node_modules'), { force: true });
  await symlink(join(projectRoot, 'node_modules'), join(workspace, 'node_modules'));
  await symlink(join(projectRoot, 'node_modules'), join(checkRoot, 'node_modules'));
  await mkdir(outputRoot, { recursive: true });
  await writeFile(join(workspace, 'snapshot.ready'), 'strict checks pending\n');
  return { checkRoot, outputRoot };
}
