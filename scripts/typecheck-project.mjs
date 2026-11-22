import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const worker = fileURLToPath(new URL('./typecheck-worker.mjs', import.meta.url));
const sourceRoot = join(projectRoot, 'src');
const sourceIndex = join(projectRoot, 'src/index.ts');
const memoryMiB = 1280;
const singleFileMemoryMiB = 1536;
// Keep heavy Storybook type graphs below the worker's memory cap.
const batchSize = 4;

/** Require declarations from the current source and compiler configuration. */
function declarationTimestamp() {
  const entry = join(projectRoot, 'dist/index.d.ts');
  assert.ok(existsSync(entry), 'Build declarations before running the project typecheck.');
  const timestamp = statSync(entry).mtimeMs;
  for (const name of ['package.json', 'pnpm-lock.yaml', 'tsconfig.json', 'tsconfig.build.json']) {
    assert.ok(
      statSync(join(projectRoot, name)).mtimeMs <= timestamp,
      `Build declarations after changing ${name}.`,
    );
  }
  return timestamp;
}

/** Read every root from the real project configuration before batching. */
function projectFiles(configPath, timestamp) {
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  if (config.error) {
    throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
  }
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, projectRoot);
  assert.equal(parsed.errors.length, 0, `TypeScript configuration has errors: ${configPath}`);
  return parsed.fileNames.filter(
    /** Skip source roots already checked and emitted by the fresh build. */
    (file) => {
      if (file === sourceIndex) return false;
      if (!file.startsWith(`${sourceRoot}/`) || /\.(?:test|stories)\.tsx?$/.test(file)) return true;
      assert.ok(statSync(file).mtimeMs <= timestamp, `Build declarations after changing ${file}.`);
      const declaration = join(projectRoot, 'dist', relative(sourceRoot, file)).replace(
        /\.tsx?$/,
        '.d.ts',
      );
      return !existsSync(declaration);
    },
  );
}

/** Check a bounded source group, splitting only when its graph exceeds memory. */
function checkBatch(configPath, files, limitMiB = memoryMiB) {
  const result = spawnSync(
    process.execPath,
    [`--max-old-space-size=${limitMiB}`, worker, configPath, ...files],
    {
      cwd: projectRoot,
      encoding: 'utf8',
      maxBuffer: 8 * 1024 * 1024,
      timeout: files.length === 1 ? 600_000 : 180_000,
      killSignal: 'SIGKILL',
    },
  );
  if (result.status === 0) return;
  const details = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  if (
    (details.includes('heap out of memory') || result.error?.code === 'ETIMEDOUT') &&
    files.length > 1
  ) {
    const middle = Math.floor(files.length / 2);
    checkBatch(configPath, files.slice(0, middle));
    checkBatch(configPath, files.slice(middle));
    return;
  }
  if (details.includes('heap out of memory') && limitMiB < singleFileMemoryMiB) {
    console.log(`Retrying ${relative(projectRoot, files[0])} with a 1.5 GiB heap cap.`);
    checkBatch(configPath, files, singleFileMemoryMiB);
    return;
  }
  if (result.error) throw result.error;
  const names = files.map(
    /** Identify the configured roots in a failed batch. */
    (file) => relative(projectRoot, file),
  );
  throw new Error(`Typecheck failed for ${names}:\n${details}`);
}

/** Typecheck every configured root through sequential capped processes. */
function main() {
  const timestamp = declarationTimestamp();
  const requestedConfig = process.argv.find(
    /** Select one project for a focused tooling check. */
    (argument) => argument.startsWith('--config='),
  );
  const requestedFile = process.argv.find(
    /** Select one configured root for a focused tooling check. */
    (argument) => argument.startsWith('--file='),
  );
  const startArgument = process.argv.find(
    /** Resume diagnostics after an unchanged, already checked prefix. */
    (argument) => argument.startsWith('--start='),
  );
  const start = Number(startArgument?.slice('--start='.length) ?? 0);
  const collectFailures = process.argv.includes('--collect');
  const failures = [];
  assert.ok(Number.isInteger(start) && start >= 0 && start % batchSize === 0);
  const configs = requestedConfig
    ? [resolve(requestedConfig.slice('--config='.length))]
    : ['tsconfig.json', 'tsconfig.examples.json'].map(
        /** Resolve each maintained TypeScript project from the package root. */
        (name) => join(projectRoot, name),
      );
  let matched = false;
  for (const configPath of configs) {
    const allFiles = projectFiles(configPath, timestamp);
    const files = requestedFile
      ? allFiles.filter(
          /** Restrict the focused run to the selected configured file. */
          (file) => file === resolve(requestedFile.slice('--file='.length)),
        )
      : allFiles;
    if (requestedFile && files.length === 0) continue;
    matched = true;
    assert.ok(files.length > 0, `No matching roots in ${configPath}.`);
    console.log(`Checking ${files.length} roots from ${relative(projectRoot, configPath)}.`);
    if (process.argv.includes('--plan')) continue;
    assert.ok(start < files.length, `Start offset exceeds ${configPath}.`);
    for (let offset = start; offset < files.length; offset += batchSize) {
      try {
        checkBatch(configPath, files.slice(offset, offset + batchSize));
        console.log(`Checked ${Math.min(offset + batchSize, files.length)}/${files.length} roots.`);
      } catch (error) {
        if (!collectFailures) throw error;
        const detail = error instanceof Error ? error.message : String(error);
        failures.push(detail);
        console.error(detail);
      }
    }
  }
  assert.ok(matched, 'No configured TypeScript root matched the requested file.');
  assert.equal(failures.length, 0, `${failures.length} TypeScript batches failed.`);
}

main();
