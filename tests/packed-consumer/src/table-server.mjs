import assert from 'node:assert/strict';
import { TableBody, TableCaption, TableCell, TableRoot, TableRow } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed Table parts through the package's server entry. */
function renderPackedTable() {
  return renderToString(
    /** Establish the installed package's styling context. */
    () =>
      createComponent(TableRoot, {
        id: 'packed-server-table',
        size: 'sm',
        /** Render caption and body with their scoped styles. */
        get children() {
          return [
            createComponent(TableCaption, { children: 'Installed inventory' }),
            createComponent(TableBody, {
              /** Keep the row under the body. */
              get children() {
                return createComponent(TableRow, {
                  /** Keep the cell under its semantic row. */
                  get children() {
                    return createComponent(TableCell, { children: 'Notebook' });
                  },
                });
              },
            }),
          ];
        },
      }),
  );
}

const markup = renderPackedTable();
assert.match(markup, /<table[^>]*id="packed-server-table"/);
assert.match(markup, /<caption[^>]*>Installed inventory<\/caption>/);
assert.match(markup, /<tbody[^>]*>.*<tr[^>]*>.*<td[^>]*>Notebook<\/td>/s);
assert.match(markup, /leverui-table__cell/);
assert.doesNotMatch(markup, /<table[^>]*\s(?:size|variant|native)=/);
