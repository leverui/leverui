import assert from 'node:assert/strict';
import { Sticky } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed Sticky through its published server entry. */
function renderInstalledSticky() {
  return renderToString(
    /** Render Sticky through the published server entry. */
    () =>
      createComponent(Sticky, {
        id: 'packed-server-sticky',
        title: 'Installed sticky',
        style: { top: '16px' },
        children: 'Server sticky content',
      }),
  );
}

const markup = renderInstalledSticky();
assert.match(markup, /id="packed-server-sticky"/);
assert.match(markup, /title="Installed sticky"/);
assert.match(markup, /Server sticky content/);
assert.match(markup, /leverui-sticky/);
assert.doesNotMatch(markup, /position:sticky/);
assert.match(markup, /top:16px/);
assert.doesNotMatch(markup, /\s(?:css|unstyled|asChild)=/);
console.log('Packed Sticky server rendering passed.');
