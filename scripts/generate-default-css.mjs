import { readFile, readdir, writeFile } from 'node:fs/promises';
import { transform } from 'esbuild';
import { verifyAuthoredCssContract } from './authored-css-contract.mjs';
import { defaultCssFiles } from './default-css-sources.mjs';

const output = new URL('../dist/styles.css', import.meta.url);
const sourceDirectory = new URL('../src/styles/', import.meta.url);

// The same widths as the `--leverui-breakpoints-*` variables and `breakpoint-thresholds.ts`.
const breakpointWidths = ['480px', '768px', '1024px', '1280px', '1536px'];

const layerOrder =
  '@layer leverui.reset,leverui.base,leverui.tokens,leverui.recipes,leverui.utilities;';

/** Keep the ordered bundle list synchronized with every authored CSS file. */
async function verifySourceList() {
  const available = (await readdir(sourceDirectory)).filter((name) => name.endsWith('.css'));
  const unlisted = available.filter((name) => !defaultCssFiles.includes(name));
  if (unlisted.length) {
    throw new Error(`CSS source is absent from the bundle list: ${unlisted.join(', ')}`);
  }
}

/** Reject a width query that is not one of the five pixel breakpoints. */
function verifyBreakpoints(name, css) {
  for (const [query] of css.matchAll(/@media[^{]*width[^{]*/g)) {
    for (const [width] of query.matchAll(/[\d.]+[a-z]+/g)) {
      if (!breakpointWidths.includes(width)) {
        throw new Error(
          `CSS source uses a width that is not a breakpoint: ${name}: ${query.trim()}`,
        );
      }
    }
  }
}

/** Read one authored CSS fragment and reject source files over the project limit. */
async function readSource(name) {
  const css = await readFile(new URL(name, sourceDirectory), 'utf8');
  verifyBreakpoints(name, css);
  if (css.trimEnd().split('\n').length > 200) {
    throw new Error(`CSS source exceeds 200 lines: ${name}`);
  }
  if (!css.startsWith('@layer leverui.')) {
    throw new Error(`CSS source must declare a Lever UI layer: ${name}`);
  }
  return css.trimEnd();
}

/** Keep each fragment's name available to the public selector check. */
async function loadSource(name) {
  return [name, await readSource(name)];
}

await verifySourceList();
const sources = new Map(await Promise.all(defaultCssFiles.map(loadSource)));
verifyAuthoredCssContract(sources);
const authored = `${layerOrder}\n${[...sources.values()].join('\n')}\n`;
// Remove only whitespace and comments. Rewriting values would change what code reads back
// from a variable, such as `150ms` becoming `.15s`.
const { code: css } = await transform(authored, { loader: 'css', minifyWhitespace: true });
if (!css.includes('--leverui-colors-bg:')) {
  throw new Error('The default stylesheet is missing semantic color tokens.');
}

if (process.argv.includes('--check')) {
  const current = await readFile(output, 'utf8');
  if (current !== css) throw new Error('Default CSS is stale; run pnpm build.');
  console.log('Default stylesheet matches authored Lever UI CSS.');
} else {
  await writeFile(output, css);
  console.log('Bundled and minified authored Lever UI CSS into dist/styles.css.');
}
