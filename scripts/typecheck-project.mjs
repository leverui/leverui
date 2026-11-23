import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { availableParallelism, totalmem } from 'node:os';
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
// Each worker can reach its heap cap, so run one per CPU and per 3 GiB of memory.
const jobs = Number(
  process.env.LEVERUI_TYPECHECK_JOBS ??
    Math.max(1, Math.min(availableParallelism(), Math.floor(totalmem() / 3 / 1024 ** 3))),
);

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

/** Run one capped worker over a group of roots and report how it ended. */
function runWorker(configPath, files, limitMiB) {
  return new Promise(
    /** Settle once the worker exits, fails to start, or is stopped at its time limit. */
    (settle) => {
      execFile(
        process.execPath,
        [`--max-old-space-size=${limitMiB}`, worker, configPath, ...files],
        {
          cwd: projectRoot,
          encoding: 'utf8',
          maxBuffer: 8 * 1024 * 1024,
          timeout: files.length === 1 ? 600_000 : 180_000,
          killSignal: 'SIGKILL',
        },
        /** Keep the worker's output with how it ended. */
        (error, stdout, stderr) => settle({ error, details: `${stdout}\n${stderr}` }),
      );
    },
  );
}

/** Check a bounded source group, splitting only when its graph exceeds memory. */
async function checkBatch(configPath, files, limitMiB = memoryMiB) {
  const { error, details } = await runWorker(configPath, files, limitMiB);
  if (!error) return;
  const outOfMemory = details.includes('heap out of memory');
  if ((outOfMemory || error.killed) && files.length > 1) {
    const middle = Math.floor(files.length / 2);
    await checkBatch(configPath, files.slice(0, middle));
    await checkBatch(configPath, files.slice(middle));
    return;
  }
  if (outOfMemory && limitMiB < singleFileMemoryMiB) {
    console.log(`Retrying ${relative(projectRoot, files[0])} with a 1.5 GiB heap cap.`);
    await checkBatch(configPath, files, singleFileMemoryMiB);
    return;
  }
  const names = files.map(
    /** Identify the configured roots in a failed batch. */
    (file) => relative(projectRoot, file),
  );
  const reason = error.killed ? 'timed out' : 'failed';
  throw new Error(`Typecheck ${reason} for ${names}:\n${details}`);
}

/** Check one project's roots in batches, several workers at a time. */
async function checkRoots(configPath, files, start, failures) {
  const batches = [];
  for (let offset = start; offset < files.length; offset += batchSize) {
    batches.push(files.slice(offset, offset + batchSize));
  }
  let next = 0;
  let checked = start;
  let stopError;
  /** Take batches until none are left or one fails outside collect mode. */
  async function work() {
    while (next < batches.length && !stopError) {
      const batch = batches[next];
      next += 1;
      try {
        await checkBatch(configPath, batch);
        checked += batch.length;
        console.log(`Checked ${checked}/${files.length} roots.`);
      } catch (error) {
        if (!failures) {
          stopError ??= error;
          return;
        }
        const detail = error instanceof Error ? error.message : String(error);
        failures.push(detail);
        console.error(detail);
      }
    }
  }
  await Promise.all(
    Array.from(
      { length: Math.min(jobs, batches.length) },
      /** Start one worker loop. */
      () => work(),
    ),
  );
  if (stopError) throw stopError;
}

/** Typecheck every configured root through capped processes that run side by side. */
async function main() {
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
  const failures = process.argv.includes('--collect') ? [] : undefined;
  assert.ok(Number.isInteger(start) && start >= 0 && start % batchSize === 0);
  assert.ok(Number.isInteger(jobs) && jobs >= 1, 'LEVERUI_TYPECHECK_JOBS must be at least 1.');
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
    console.log(
      `Checking ${files.length} roots from ${relative(projectRoot, configPath)} with ${jobs} workers.`,
    );
    if (process.argv.includes('--plan')) continue;
    assert.ok(start < files.length, `Start offset exceeds ${configPath}.`);
    await checkRoots(configPath, files, start, failures);
  }
  assert.ok(matched, 'No configured TypeScript root matched the requested file.');
  assert.equal(failures?.length ?? 0, 0, `${failures?.length} TypeScript batches failed.`);
}

await main();
