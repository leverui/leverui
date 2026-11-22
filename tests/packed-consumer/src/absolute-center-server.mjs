import assert from 'node:assert/strict';
import { AbsoluteCenter } from '@leverui/components';
import { createComponent } from 'solid-js';
import { Dynamic, renderToString } from '@solidjs/web';

/** Render the installed layout component in a positioned server parent. */
function renderInstalledCenter() {
  return renderToString(
    /** Establish a native containing block for the installed child. */
    () =>
      createComponent(Dynamic, {
        component: 'div',
        style: { position: 'relative', width: '240px', height: '160px' },
        /** Render the default center through the package's node entry. */
        get children() {
          return createComponent(AbsoluteCenter, {
            id: 'packed-server-center',
            children: 'Installed server center',
          });
        },
      }),
  );
}

const markup = renderInstalledCenter();
assert.match(markup, /id="packed-server-center"/);
assert.match(markup, /Installed server center/);
assert.match(markup, /leverui-absolute-center/);
assert.match(markup, /data-axis="both"/);
assert.doesNotMatch(markup, /\saxis=/);
console.log('Packed AbsoluteCenter server rendering passed.');
