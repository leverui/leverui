import assert from 'node:assert/strict';
import { Code } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render Code through the installed package's server entry. */
function renderInstalledCode() {
  return renderToString(
    /** Render installed Code with packaged CSS. */
    () =>
      createComponent(Code, {
        id: 'packed-server-code',
        size: 'lg',
        variant: 'solid',
        colorPalette: 'blue',
        children: 'npm run build',
      }),
  );
}

const markup = renderInstalledCode();
assert.match(markup, /<code[^>]*id="packed-server-code"/);
assert.match(markup, /lui-code/);
assert.match(markup, /npm run build/);
assert.doesNotMatch(markup, /\s(?:size|variant|colorPalette)=/);
console.log('Packed Code server rendering passed.');
