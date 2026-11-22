import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const verifier = fileURLToPath(
  new URL('../../scripts/verify-declaration-graph.mjs', import.meta.url),
);

/** Build a tiny published declaration graph and return its verifier result. */
async function verifyFixture(exportName) {
  const root = await mkdtemp(join(tmpdir(), 'leverui-declaration-graph-'));
  try {
    await mkdir(join(root, 'theme'));
    await mkdir(join(root, 'styled-system'));
    await writeFile(join(root, 'index.d.ts'), `export type { ${exportName} } from './value';`);
    await writeFile(join(root, 'value.d.ts'), 'export type Present = string;');
    await writeFile(join(root, 'theme/index.d.ts'), 'export {};');
    await writeFile(join(root, 'styled-system/index.d.ts'), 'export {};');
    await writeFile(join(root, 'styled-system/theme-extensions.d.ts'), 'export {};');
    return spawnSync(process.execPath, ['--max-old-space-size=512', verifier, root], {
      encoding: 'utf8',
      timeout: 30_000,
    });
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test('public declaration graph accepts an existing type-only export' /** Check that valid exports pass the same publication verifier. */, async () => {
  const result = await verifyFixture('Present');
  assert.equal(result.status, 0, result.stderr);
});

test('public declaration graph rejects a missing type-only export' /** Catch the barrel error that a copied declaration used to miss. */, async () => {
  const result = await verifyFixture('Missing');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /has no exported member 'Missing'/);
});
