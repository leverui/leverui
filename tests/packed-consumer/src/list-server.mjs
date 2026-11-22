import assert from 'node:assert/strict';
import { ListRoot, ListItem, ListIndicator } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed semantic List exports with packaged CSS. */
function renderPackedList() {
  return renderToString(
    /** Mount a native ordered List with an authored indicator. */
    () =>
      createComponent(ListRoot, {
        as: 'ol',
        role: 'list',
        id: 'packed-server-list',
        variant: 'plain',
        /** Keep the item inside its nearest List context. */
        get children() {
          return createComponent(ListItem, {
            id: 'packed-server-item',
            /** Include both the indicator and ordinary item content. */
            get children() {
              return [
                createComponent(ListIndicator, {
                  id: 'packed-server-indicator',
                  children: '✓',
                }),
                'Server item',
              ];
            },
          });
        },
      }),
  );
}

const markup = renderPackedList();
assert.match(markup, /<ol[^>]*id="packed-server-list"/);
assert.match(markup, /role="list"/);
assert.match(markup, /<li[^>]*id="packed-server-item"/);
assert.match(markup, /<span[^>]*id="packed-server-indicator"/);
assert.match(markup, /leverui-list__root/);
assert.match(markup, /id="packed-server-list"[^>]*data-variant="plain"/);
assert.doesNotMatch(markup, /\s(?:variant|align|as)=/);
