import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Flex } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Flex through the published node entry. */
function renderInstalledFlex() {
  return renderToString(
    /** Render Flex through the published server entry. */
    () =>
      createComponent(Flex, {
        id: 'packed-server-flex',
        direction: 'column',
        justify: 'space-between',
        children: 'Installed server flex',
      }),
  );
}

const markup = renderInstalledFlex();
const stylesheet = readFileSync(
  new URL(import.meta.resolve('@leverui/components/styles.css')),
  'utf8',
);
assert.match(markup, /id="packed-server-flex"/);
assert.match(markup, /Installed server flex/);
assert.match(markup, /class="leverui-flex\b/);
assert.match(markup, /--lui-private-flex-direction-base:column/);
assert.match(markup, /--lui-private-flex-justify-base:space-between/);
assert.match(stylesheet, /\.leverui-flex\s*\{[^}]*display: flex;/);
assert.match(stylesheet, /flex-direction: var\(--lui-private-flex-direction-base/);
assert.match(stylesheet, /justify-content: var\(--lui-private-flex-justify-base/);
assert.doesNotMatch(markup, /\s(?:direction|justify|css)=/);
console.log('Packed Flex server rendering passed.');
