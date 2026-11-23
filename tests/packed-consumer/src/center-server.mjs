import assert from 'node:assert/strict';
import { Center } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed Center from its published node entry. */
function renderInstalledCenter() {
  return renderToString(
    /** Render Center through the published server entry. */
    () =>
      createComponent(Center, {
        id: 'packed-server-flex-center',
        inline: true,
        children: 'Installed server center',
      }),
  );
}

const markup = renderInstalledCenter();
assert.match(markup, /id="packed-server-flex-center"/);
assert.match(markup, /Installed server center/);
assert.match(markup, /lui-center/);
assert.match(markup, /data-inline="true"/);
assert.doesNotMatch(markup, /\sinline=/);
console.log('Packed Center server rendering passed.');
