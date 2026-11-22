import assert from 'node:assert/strict';
import { Presence } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed Presence with packaged CSS. */
function renderPackedPresence(present) {
  return createComponent(Presence, { present, children: 'Installed presence' });
}

assert.match(
  renderToString(
    /** Render the installed initially visible state. */
    () => renderPackedPresence(true),
  ),
  /Installed presence/,
);
assert.match(
  renderToString(
    /** Render the installed initially hidden state. */
    () => renderPackedPresence(false),
  ),
  /hidden/,
);
console.log('Packed presence server rendering passed.');
