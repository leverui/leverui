import assert from 'node:assert/strict';
import { ScrollArea } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render the installed package without a browser environment. */
function renderPackedScrollArea() {
  return renderToString(
    /** Keep the machine root inside the published server tree. */
    () =>
      createComponent(ScrollArea.Root, {
        id: 'packed-scroll-area',
        /** Create the viewport while the machine context is active. */
        get children() {
          return createComponent(ScrollArea.Viewport, {
            /** Keep content beneath the installed viewport. */
            get children() {
              return createComponent(ScrollArea.Content, {
                children: 'Packed scroll content',
              });
            },
          });
        },
      }),
  );
}

const markup = renderPackedScrollArea();
assert.match(markup, /data-scroll-area-viewport/);
assert.match(markup, /data-scroll-area-content/);
assert.match(markup, /Packed scroll content/);
