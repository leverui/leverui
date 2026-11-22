import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Grid, GridItem } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed grid exports through the published server entry. */
function renderInstalledGrid() {
  return renderToString(
    /** Render Grid through the published server entry. */
    () =>
      createComponent(Grid, {
        id: 'packed-server-grid',
        templateColumns: '40px 40px',
        style: { gap: 'var(--leverui-spacing-4)' },
        /** Supply an item with a numeric track span. */
        get children() {
          return createComponent(GridItem, {
            id: 'packed-server-grid-item',
            colSpan: 2,
            children: 'Installed server grid',
          });
        },
      }),
  );
}

const markup = renderInstalledGrid();
const stylesheet = readFileSync(
  new URL(import.meta.resolve('@leverui/components/styles.css')),
  'utf8',
);
assert.match(markup, /id="packed-server-grid"/);
assert.match(markup, /Installed server grid/);
assert.match(markup, /class="leverui-grid\b/);
assert.match(markup, /class="leverui-grid-item\b/);
assert.match(markup, /--leverui-private-grid-template-columns-base:40px 40px/);
assert.match(markup, /gap:var\(--leverui-spacing-4\)/);
assert.match(markup, /--leverui-private-grid-item-column-base:span 2\/span 2/);
assert.match(stylesheet, /\.leverui-grid\s*\{[^}]*display: grid;/);
assert.match(
  stylesheet,
  /grid-template-columns: var\(--leverui-private-grid-template-columns-base/,
);
assert.doesNotMatch(markup, /\s(?:templateColumns|colSpan|css|gap)=/);
console.log('Packed Grid server rendering passed.');
