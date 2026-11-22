import assert from 'node:assert/strict';
import { Show } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render one Show condition through the installed server entry. */
function renderPackedShow(when) {
  return renderToString(
    /** Keep the condition inside one server render request. */
    () => createComponent(Show, { when, fallback: 'Missing', children: 'Installed show' }),
  );
}

assert.match(renderPackedShow(true), /Installed show/);
assert.match(renderPackedShow(false), /Missing/);
assert.doesNotMatch(renderPackedShow(false), /Installed show/);
console.log('Packed Show server rendering passed.');
