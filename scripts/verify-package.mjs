import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { createComponent, renderToString } from '@solidjs/web';
import { Box } from '../dist/server/index.js';

await access(new URL('../dist/index.js', import.meta.url));
await access(new URL('../dist/index.d.ts', import.meta.url));
const defaultCss = await readFile(new URL('../dist/styles.css', import.meta.url), 'utf8');
const manifest = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

assert.equal(manifest.exports['./styles.css'], './dist/styles.css');
assert.deepEqual(manifest.sideEffects, ['**/*.css']);
assert.equal(
  import.meta.resolve('@leverui/components/styles.css'),
  new URL('../dist/styles.css', import.meta.url).href,
);
assert.match(defaultCss, /@layer lui\.reset,lui\.base,lui\.tokens,lui\.recipes,lui\.utilities;/);
assert.match(defaultCss, /--lui-colors-bg:/);
assert.match(defaultCss, /--lui-spacing-4:/);
assert.match(defaultCss, /\.lui-box\s*\{\s*box-sizing:\s*border-box[;}]/);
assert.doesNotMatch(defaultCss, /chakra/i);

assert.equal(manifest.exports['./styled-system'], undefined);
assert.equal(manifest.exports['./theme-extensions'], undefined);
for (const name of [
  '@emotion/cache',
  '@emotion/is-prop-valid',
  '@emotion/serialize',
  '@pandacss/is-valid-prop',
]) {
  assert.equal(manifest.dependencies[name], undefined, `${name} remains a shipped dependency`);
}

/** Render a provider-free Box using the published server entry. */
function renderExample() {
  return createComponent(Box, { children: 'Lever UI', class: 'consumer-box' });
}

const html = renderToString(renderExample);

assert.match(html, /Lever UI/);
assert.match(html, /class="lui-box consumer-box\s*"/);
assert.doesNotMatch(html, /data-emotion=/);
assert.doesNotMatch(html, /chakra-/);

const distRoot = new URL('../dist/', import.meta.url);
for (const file of await readdir(distRoot, { recursive: true })) {
  if (!/\.(?:js|d\.ts|css)$/.test(file)) continue;
  const source = await readFile(new URL(file, distRoot), 'utf8');
  assert.doesNotMatch(source, /chakra/i, `${file} exposes Chakra branding`);
  assert.doesNotMatch(source, /@emotion|@pandacss/, `${file} exposes a CSS-in-JS runtime`);
}

console.log('Package exports, authored CSS, and provider-free server rendering verified.');
