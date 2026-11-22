import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isExcludedPackagePath } from './package-content-policy.mjs';
import { readPackedFiles } from './read-packed-files.mjs';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const allowedDirectories = new Set(['dist']);
const standardFiles = [
  'CHANGELOG.md',
  'LICENSE',
  'README.md',
  'THIRD_PARTY_LICENSES',
  'package.json',
];

/** Ensure local links in packed documentation resolve inside the archive. */
async function verifyDocumentLinks(paths) {
  for (const guide of ['README.md', 'CHANGELOG.md']) {
    const source = await readFile(join(projectRoot, guide), 'utf8');
    for (const match of source.matchAll(/\]\(([^)]+)\)/g)) {
      const href = match[1];
      if (href.startsWith('#') || /^[a-z][a-z\d+.-]*:/i.test(href)) continue;
      const target = posix.normalize(posix.join(posix.dirname(guide), href.split(/[?#]/)[0]));
      assert.ok(paths.has(target), `${guide} links to unpacked file ${target}`);
    }
  }
}

/** Check the package archive against its public entrypoints and owned files. */
async function main() {
  const manifest = JSON.parse(await readFile(join(projectRoot, 'package.json'), 'utf8'));
  const paths = await readPackedFiles(projectRoot);
  const requiredFiles = new Set(standardFiles);

  for (const path of paths) {
    const directory = path.split('/')[0];
    assert.ok(
      requiredFiles.has(path) || allowedDirectories.has(directory),
      `Unexpected package file: ${path}`,
    );
    assert.equal(isExcludedPackagePath(path), false, `Unexpected test or story file: ${path}`);
  }
  for (const path of requiredFiles) {
    assert.ok(paths.has(path), `Required package file is missing: ${path}`);
  }
  await verifyDocumentLinks(paths);

  for (const [entry, conditions] of Object.entries(manifest.exports)) {
    const targets = typeof conditions === 'string' ? [conditions] : Object.values(conditions);
    for (const target of targets) {
      assert.ok(paths.has(target.slice(2)), `${entry} points to unpacked file ${target}`);
    }
  }
  assert.equal(manifest.bin, undefined, 'The package must not ship a CLI.');

  console.log(`Package contents verified: ${paths.size} files and all public entrypoints.`);
}

await main();
