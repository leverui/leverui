import { spawnSync } from 'node:child_process';
import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  isDeclarationBatchComplete,
  markDeclarationBatchComplete,
} from './declaration-workspace.mjs';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const sourceRoot = join(projectRoot, 'src');
const compiler = join(projectRoot, 'node_modules/typescript/bin/tsc');

/** Copy one source file over its provisional declaration for strict checking. */
async function copySource(file, checkRoot) {
  const target = join(checkRoot, relative(sourceRoot, file));
  await mkdir(dirname(target), { recursive: true });
  await cp(file, target);
  return target;
}

/** Replace provisional dependencies with declarations from a passing strict batch. */
async function refreshCheckedDependencies(files, checkRoot, outputRoot) {
  await Promise.all(
    files.map(
      /** Preserve the source tree's relative declaration path. */
      (file) => {
        const declaration = relative(sourceRoot, file).replace(/\.tsx?$/, '.d.ts');
        return cp(join(outputRoot, declaration), join(checkRoot, declaration));
      },
    ),
  );
}

/** Strictly compile a bounded source group against declaration dependencies. */
async function compileFiles(files, configPrefix, checkRoot, outputRoot, memoryMiB) {
  const copied = await Promise.all(
    files.map(
      /** Place each checked source beside its declaration dependencies. */
      (file) => copySource(file, checkRoot),
    ),
  );
  const configPath = `${configPrefix}.json`;
  try {
    await writeFile(
      configPath,
      JSON.stringify({
        extends: join(projectRoot, 'tsconfig.build.json'),
        files: copied,
        include: [],
        exclude: [],
        compilerOptions: { rootDir: checkRoot, outDir: outputRoot, noEmitOnError: true },
      }),
    );
    const result = spawnSync(
      process.execPath,
      [`--max-old-space-size=${memoryMiB}`, compiler, '-p', configPath],
      {
        cwd: projectRoot,
        encoding: 'utf8',
        maxBuffer: 8 * 1024 * 1024,
        timeout: files.length === 1 ? 600_000 : 180_000,
        killSignal: 'SIGKILL',
      },
    );
    if (result.status === 0) {
      await refreshCheckedDependencies(files, checkRoot, outputRoot);
      return;
    }
    const details = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
    if (
      files.length > 1 &&
      (details.includes('heap out of memory') || result.error?.code === 'ETIMEDOUT')
    ) {
      console.log(`Splitting bounded declaration batch ${relative(projectRoot, configPrefix)}.`);
      const middle = Math.floor(files.length / 2);
      await Promise.all(
        copied.map(
          /** Remove the larger failed group before checking either half. */
          (file) => rm(file),
        ),
      );
      await compileFiles(
        files.slice(0, middle),
        `${configPrefix}-a`,
        checkRoot,
        outputRoot,
        memoryMiB,
      );
      await compileFiles(
        files.slice(middle),
        `${configPrefix}-b`,
        checkRoot,
        outputRoot,
        memoryMiB,
      );
      return;
    }
    if (result.error) throw result.error;
    throw new Error(`Declaration check failed for ${files.join(', ')}:\n${details}`);
  } finally {
    await Promise.all(
      copied.map(
        /** Restore the declaration-only dependency graph after this check. */
        (file) => rm(file, { force: true }),
      ),
    );
  }
}

/** Typecheck and emit one source batch under a fixed heap limit. */
export async function compileBatch(
  files,
  workspace,
  checkRoot,
  outputRoot,
  number,
  total,
  memoryMiB,
) {
  if (await isDeclarationBatchComplete(workspace, number, files)) {
    console.log(`Declaration batch ${number}/${total} already passed.`);
    return;
  }
  const names = files
    .map(
      /** Show each checked module relative to the source root. */
      (file) => relative(sourceRoot, file),
    )
    .join(', ');
  console.log(`Checking declaration batch ${number}/${total}: ${names}`);
  await compileFiles(files, join(workspace, `batch-${number}`), checkRoot, outputRoot, memoryMiB);
  await markDeclarationBatchComplete(workspace, number, files);
  console.log(`Declaration batch ${number}/${total} passed.`);
}
