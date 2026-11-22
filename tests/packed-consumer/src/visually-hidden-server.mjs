import assert from 'node:assert/strict';
import { VisuallyHidden } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed hidden component with packaged CSS. */
function renderHidden() {
  return renderToString(
    /** Preserve text in the server's accessibility tree. */
    () =>
      createComponent(VisuallyHidden, {
        id: 'packed-server-hidden',
        children: 'Server hidden text',
      }),
  );
}

const markup = renderHidden();
assert.match(markup, /<span[^>]*id="packed-server-hidden"/);
assert.match(markup, /Server hidden text/);
assert.match(markup, /leverui-visually-hidden/);
assert.doesNotMatch(markup, /style="[^"]*clip/);
assert.doesNotMatch(markup, /aria-hidden="true"/);
console.log('Packed Visually Hidden server rendering passed.');
