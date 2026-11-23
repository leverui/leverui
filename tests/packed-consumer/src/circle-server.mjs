import assert from 'node:assert/strict';
import { Circle } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Circle from its published node entry. */
function renderInstalledCircle() {
  return renderToString(
    /** Render Circle through the published server entry. */
    () =>
      createComponent(Circle, {
        id: 'packed-server-circle',
        size: '10',
        style: { position: 'fixed' },
        children: 'Installed server circle',
      }),
  );
}

const markup = renderInstalledCircle();
assert.match(markup, /id="packed-server-circle"/);
assert.match(markup, /Installed server circle/);
assert.match(markup, /leverui-circle/);
assert.match(markup, /--lui-private-square-size-base:/);
assert.doesNotMatch(markup, /border-radius:9999px/);
assert.match(markup, /position:fixed/);
assert.doesNotMatch(markup, /\s(?:size|css)=/);
console.log('Packed Circle server rendering passed.');
