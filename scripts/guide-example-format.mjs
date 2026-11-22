import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';

const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const cacheFile = path.join(projectRoot, 'node_modules/.cache/leverui-guide-examples/format.json');
const usedEntries = {};
let cachedEntries;

/** Read the formatted modules saved by the previous generation run. */
function previousEntries() {
  if (!cachedEntries) {
    try {
      cachedEntries = JSON.parse(readFileSync(cacheFile, 'utf8'));
    } catch {
      cachedEntries = {};
    }
    process.once(
      'exit',
      /** Keep only this run's modules, so the cache never outgrows the examples. */
      () => {
        mkdirSync(path.dirname(cacheFile), { recursive: true });
        writeFileSync(cacheFile, JSON.stringify(usedEntries));
      },
    );
  }
  return cachedEntries;
}

/**
 * Format a generated module with the repository's Prettier configuration. Formatting all
 * examples takes several seconds, so results are cached by their exact input and options.
 */
export async function formatModule(source, filepath) {
  const options = { ...(await prettier.resolveConfig(filepath)), filepath };
  const key = createHash('sha256')
    .update(JSON.stringify([prettier.version, options, source]))
    .digest('hex');
  const formatted = previousEntries()[key] ?? (await prettier.format(source, options)).trim();
  usedEntries[key] = formatted;
  return formatted;
}
