import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';

const batchSize = 4;
const memoryMiB = 1024;
const singleFileMemoryMiB = 1536;

/** Check one consumer root group within a fixed Node heap. */
function checkGroup(directory, configPath, temporaryConfig, declarations, files) {
  const memoryLimitMiB = files.length === 1 ? singleFileMemoryMiB : memoryMiB;
  writeFileSync(
    temporaryConfig,
    `${JSON.stringify({ extends: configPath, files: [...declarations, ...files], include: [], exclude: [] })}\n`,
  );
  const result = spawnSync(
    process.execPath,
    [
      `--max-old-space-size=${memoryLimitMiB}`,
      join(directory, 'node_modules/typescript/bin/tsc'),
      '--noEmit',
      '-p',
      temporaryConfig,
    ],
    {
      cwd: directory,
      encoding: 'utf8',
      maxBuffer: 8 * 1024 * 1024,
      timeout: files.length === 1 ? 600_000 : 180_000,
    },
  );
  if (result.status === 0) return;
  const details = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
  const resourceExhausted =
    details.includes('heap out of memory') || result.error?.code === 'ETIMEDOUT';
  if (resourceExhausted && files.length > 1) {
    const middle = Math.floor(files.length / 2);
    checkGroup(directory, configPath, temporaryConfig, declarations, files.slice(0, middle));
    checkGroup(directory, configPath, temporaryConfig, declarations, files.slice(middle));
    return;
  }
  if (result.error) throw result.error;
  throw new Error(`Consumer typecheck failed for ${files.join(', ')}:\n${details}`);
}

/** Check every configured consumer root through sequential bounded processes. */
export function runBatchedConsumerTypecheck(directory, configName = 'tsconfig.json') {
  const configPath = join(directory, configName);
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  if (config.error) {
    throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
  }
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, directory);
  if (parsed.errors.length > 0) {
    let diagnostics = '';
    for (const error of parsed.errors) {
      diagnostics += `${ts.flattenDiagnosticMessageText(error.messageText, '\n')}\n`;
    }
    throw new Error(diagnostics);
  }
  if (parsed.fileNames.length === 0) throw new Error(`${configName} has no consumer roots.`);
  const declarations = [];
  const sources = [];
  for (const file of parsed.fileNames) {
    if (file.endsWith('.d.ts')) declarations.push(file);
    else sources.push(file);
  }
  const temporaryDirectory = mkdtempSync(join(directory, '.leverui-typecheck-'));
  const temporaryConfig = join(temporaryDirectory, 'tsconfig.json');
  try {
    for (let offset = 0; offset < sources.length; offset += batchSize) {
      checkGroup(
        directory,
        configPath,
        temporaryConfig,
        declarations,
        sources.slice(offset, offset + batchSize),
      );
      console.log(
        `Checked ${Math.min(offset + batchSize, sources.length)}/${sources.length} consumer roots.`,
      );
    }
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }
}
