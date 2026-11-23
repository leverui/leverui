import assert from 'node:assert/strict';
import { AspectRatio } from '@leverui/components';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString } from '@solidjs/web';

/** Render one native child through the installed server entry. */
function renderInstalledRatio() {
  return renderToString(
    /** Keep the ratio and child in one server owner. */
    () =>
      createComponent(AspectRatio, {
        id: 'packed-server-ratio',
        ratio: 1,
        style: { width: '240px' },
        /** Exercise the native child without a generated style sibling. */
        get children() {
          return createComponent(Dynamic, {
            component: 'div',
            id: 'packed-server-ratio-child',
            children: 'Installed server ratio',
          });
        },
      }),
  );
}

const markup = renderInstalledRatio();
assert.match(markup, /id="packed-server-ratio"/);
assert.match(markup, /id="packed-server-ratio-child"/);
assert.match(markup, /Installed server ratio/);
assert.match(markup, /leverui-aspect-ratio/);
assert.match(markup, /--lui-private-aspect-ratio-padding-base:100%/);
assert.doesNotMatch(markup, /\sratio=/);
console.log('Packed AspectRatio server rendering passed.');
