import assert from 'node:assert/strict';
import { Toaster, createToaster } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed package's accessible notification region. */
function renderInstalledToaster() {
  const toaster = createToaster({ placement: 'bottom-end' });
  return renderToString(
    /** Render the component through the published server entry. */
    () =>
      createComponent(Toaster, {
        toaster,
        label: 'Updates',
        /** No notification is present during this server render. */
        children: () => 'No server toast',
      }),
  );
}

const markup = renderInstalledToaster();
assert.match(markup, /data-toast-/);
assert.match(markup, /role="region"/);
assert.match(markup, /Updates/);
assert.doesNotMatch(markup, /No server toast/);
console.log('Packed Toast server rendering passed.');
