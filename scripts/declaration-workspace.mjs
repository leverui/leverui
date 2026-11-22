import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { basename, dirname, join, relative, resolve } from 'node:path';

/** Hash every source and build input that can change emitted declarations. */
async function sourceFingerprint(projectRoot) {
  const hash = createHash('sha256');

  /** Add source files in a stable path order. */
  async function addDirectory(directory) {
    for (const name of (await readdir(directory)).sort()) {
      const file = join(directory, name);
      if ((await stat(file)).isDirectory()) await addDirectory(file);
      else if (/\.tsx?$/.test(name) && !/\.(?:test|spec|stories)\.tsx?$/.test(name)) {
        hash.update(relative(projectRoot, file));
        hash.update(await readFile(file));
      }
    }
  }

  for (const name of [
    'package.json',
    'pnpm-lock.yaml',
    'tsconfig.json',
    'tsconfig.build.json',
    'scripts/build-declarations.mjs',
    'scripts/declaration-compiler.mjs',
    'scripts/declaration-snapshot.mjs',
    'scripts/declaration-output.mjs',
    'scripts/declaration-workspace.mjs',
    'scripts/verify-declaration-graph.mjs',
  ]) {
    hash.update(name);
    hash.update(await readFile(join(projectRoot, name)));
  }
  await addDirectory(join(projectRoot, 'src'));
  return hash.digest('hex');
}

/** Describe the exact inputs and public leaves compiled in one workspace. */
export async function declarationManifest(projectRoot, leaves, batchSize, compilerVersion) {
  return {
    fingerprint: await sourceFingerprint(projectRoot),
    compilerVersion,
    batchSize,
    leaves: leaves.map(
      /** Store portable paths for exact resume validation. */
      (file) => relative(projectRoot, file),
    ),
  };
}

/** Create a declaration workspace or validate a previously interrupted one. */
export async function openDeclarationWorkspace(projectRoot, resumePath, manifest) {
  if (!resumePath) {
    const workspace = await mkdtemp(join(projectRoot, '.leverui-declarations-'));
    await writeFile(join(workspace, 'manifest.json'), JSON.stringify(manifest));
    return workspace;
  }
  const workspace = resolve(resumePath);
  assert.equal(
    dirname(workspace),
    resolve(projectRoot),
    'Resume workspace must be in the project.',
  );
  assert.match(basename(workspace), /^\.leverui-declarations-[\w-]+$/);
  const previous = JSON.parse(await readFile(join(workspace, 'manifest.json'), 'utf8'));
  assert.deepEqual(previous, manifest, 'Declaration inputs changed; start a fresh build.');
  return workspace;
}

/** Skip a batch only when its exact file list has a completed marker. */
export async function isDeclarationBatchComplete(workspace, number, files) {
  try {
    const saved = JSON.parse(await readFile(join(workspace, `batch-${number}.done.json`), 'utf8'));
    assert.deepEqual(saved, files, `Declaration batch ${number} changed.`);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
}

/** Record a completed typechecked batch after its declarations are written. */
export async function markDeclarationBatchComplete(workspace, number, files) {
  await writeFile(join(workspace, `batch-${number}.done.json`), JSON.stringify(files));
}
