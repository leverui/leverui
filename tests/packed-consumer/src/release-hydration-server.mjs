import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { generateHydrationScript, renderToString } from '@solidjs/web';
import { renderReleaseHydrationTree } from './release-hydration-tree.mjs';

const page = fileURLToPath(new URL('../dist/release-hydration.html', import.meta.url));
const target = '<div id="app"></div>';
const serverExport = import.meta.resolve('@leverui/components');
assert.match(serverExport, /\/dist\/server\/index\.js$/);

/** Insert actual package server markup into the built browser page. */
async function writeServerPage() {
  const template = await readFile(page, 'utf8');
  assert.ok(template.includes(target), 'The release page is missing its app mount.');
  const markup = renderToString(renderReleaseHydrationTree);
  assert.match(markup, /Release email/);
  assert.match(markup, /data-testid="release-input"/);
  const withHydration = template.replace('</head>', `${generateHydrationScript()}</head>`);
  await writeFile(page, withHydration.replace(target, `<div id="app">${markup}</div>`));
  console.log('Packed server markup inserted into the browser page.');
}

await writeServerPage();
