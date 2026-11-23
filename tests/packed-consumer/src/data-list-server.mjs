import assert from 'node:assert/strict';
import {
  DataListRoot,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
} from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render semantic Data List parts from the isolated installed package. */
function renderInstalledDataList() {
  return createComponent(DataListRoot, {
    id: 'packed-server-data-list',
    orientation: 'horizontal',
    /** Construct a term and value inside the list's root context. */
    get children() {
      return createComponent(DataListItem, {
        /** Keep the native parts together in one item. */
        get children() {
          return [
            createComponent(DataListItemLabel, { children: 'Status' }),
            createComponent(DataListItemValue, { children: 'Active' }),
          ];
        },
      });
    },
  });
}

const markup = renderToString(renderInstalledDataList);
assert.match(markup, /<dl[^>]*id="packed-server-data-list"/);
assert.match(markup, /<div[^>]*lui-data-list__item/);
assert.match(markup, /<dt[^>]*>Status<\/dt>/);
assert.match(markup, /<dd[^>]*>Active<\/dd>/);
assert.doesNotMatch(markup, /\sorientation="horizontal"/);
console.log('Packed Data List server rendering passed.');
