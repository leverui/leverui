import assert from 'node:assert/strict';
import { SplitterPanel, SplitterResizeTrigger, SplitterRoot } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed Splitter parts through the published server entry. */
function renderInstalledSplitter() {
  return renderToString(
    /** Own the interactive machine under one Solid owner. */
    () =>
      createComponent(SplitterRoot, {
        panels: [{ id: 'a' }, { id: 'b' }],
        defaultSize: [40, 60],
        /** Preserve the order of the machine's public parts. */
        get children() {
          return [
            createComponent(SplitterPanel, { id: 'a', children: 'First' }),
            createComponent(SplitterResizeTrigger, { id: 'a:b' }),
            createComponent(SplitterPanel, { id: 'b', children: 'Second' }),
          ];
        },
      }),
  );
}

const markup = renderInstalledSplitter();
assert.match(markup, /leverui-splitter__root/);
assert.match(markup, /role="separator"/);
assert.match(markup, /aria-label="Resize"/);
assert.match(markup, /aria-valuenow="40"/);
assert.match(markup, /First/);
assert.match(markup, /Second/);
console.log('Packed Splitter server rendering passed.');
