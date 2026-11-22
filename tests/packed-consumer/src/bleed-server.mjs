import assert from 'node:assert/strict';
import { Bleed } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Bleed through its node entry and package styles. */
function renderInstalledBleed() {
  return renderToString(
    /** Render the installed component directly on the server. */
    () =>
      createComponent(Bleed, {
        id: 'packed-server-bleed',
        inline: '4',
        blockEnd: '8',
        style: { position: 'fixed' },
        children: 'Installed server bleed',
      }),
  );
}

const markup = renderInstalledBleed();
assert.match(markup, /id="packed-server-bleed"/);
assert.match(markup, /Installed server bleed/);
assert.match(markup, /leverui-bleed/);
assert.match(markup, /position:fixed/);
assert.match(markup, /--leverui-private-bleed-inline-start-base:/);
assert.match(markup, /--leverui-private-bleed-block-end-base:/);
assert.doesNotMatch(markup, /margin-inline-start:/);
assert.doesNotMatch(markup, /\s(?:inline|blockEnd|css)=/);
console.log('Packed Bleed server rendering passed.');
