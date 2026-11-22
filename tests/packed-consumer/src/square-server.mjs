import assert from 'node:assert/strict';
import { Square } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Square from its published node entry. */
function renderInstalledSquare() {
  return renderToString(
    /** Render Square through the published server entry. */
    () =>
      createComponent(Square, {
        id: 'packed-server-square',
        size: '10',
        style: { position: 'fixed' },
        children: 'Installed server square',
      }),
  );
}

const markup = renderInstalledSquare();
assert.match(markup, /id="packed-server-square"/);
assert.match(markup, /Installed server square/);
assert.match(markup, /leverui-square/);
assert.match(markup, /--leverui-private-square-size-base:/);
assert.doesNotMatch(markup, /display:flex/);
assert.match(markup, /position:fixed/);
assert.doesNotMatch(markup, /\s(?:size|css)=/);
console.log('Packed Square server rendering passed.');
