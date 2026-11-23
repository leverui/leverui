import assert from 'node:assert/strict';
import { SimpleGrid } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render installed SimpleGrid through the published server entry. */
function renderInstalledGrid() {
  return renderToString(
    /** Render the grid through the published server entry. */
    () =>
      createComponent(SimpleGrid, {
        id: 'packed-server-simple-grid',
        columns: 2,
        children: 'Installed grid',
      }),
  );
}

const markup = renderInstalledGrid();
assert.match(markup, /id="packed-server-simple-grid"/);
assert.match(markup, /lui-simple-grid/);
assert.match(markup, /--lui-private-grid-template-columns-base:repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
assert.doesNotMatch(markup, /\scolumns=/);
console.log('Packed SimpleGrid server rendering passed.');
