import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Float } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Float through its published server entry. */
function renderInstalledFloat() {
  return renderToString(
    /** Render Float through the published server entry. */
    () =>
      createComponent(Float, {
        id: 'packed-server-float',
        placement: 'bottom-start',
        offset: '4',
        offsetX: '8px',
        children: 'Installed server float',
      }),
  );
}

const markup = renderInstalledFloat();
const stylesheet = readFileSync(
  new URL(import.meta.resolve('@leverui/components/styles.css')),
  'utf8',
);
assert.match(markup, /id="packed-server-float"/);
assert.match(markup, /Installed server float/);
assert.match(markup, /class="lui-float\b/);
assert.match(markup, /data-placement-base="bottom-start"/);
assert.match(markup, /--lui-private-float-y-base:var\(--lui-spacing-4\)/);
assert.match(markup, /--lui-private-float-x-base:8px/);
assert.match(stylesheet, /\.lui-float\s*\{[^}]*display: inline-flex;/);
assert.match(stylesheet, /\.lui-float\s*\{[^}]*position: absolute;/);
assert.match(stylesheet, /\[data-placement-base\^='bottom-'\][^}]*inset-block-end:/);
assert.match(stylesheet, /\[data-placement-base\$='-start'\][^}]*inset-inline-start:/);
assert.doesNotMatch(markup, /\s(?:placement|offset|offsetX|css)=/);
console.log('Packed Float server rendering passed.');
