import assert from 'node:assert/strict';
import { For } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render a packaged list and an empty fallback on the server. */
function renderPackedFor() {
  return [
    createComponent(For, {
      each: ['One', 'Two'],
      /** Render one installed item. */
      children: (item) => item,
    }),
    createComponent(For, {
      each: [],
      fallback: 'No items',
      /** An empty collection must not invoke its child. */
      children: () => {
        throw new Error('An empty For called its child.');
      },
    }),
  ];
}

const markup = renderToString(renderPackedFor).replace(/<!--.*?-->/g, '');
assert.equal(markup, 'OneTwoNo items');

/** Confirm an absent list suppresses its fallback in the published server entry. */
function renderAbsentFor() {
  return createComponent(For, {
    each: undefined,
    fallback: 'Hidden fallback',
    /** The absent collection never invokes its child. */
    children: () => {
      throw new Error('An absent For called its child.');
    },
  });
}

/** Confirm sparse holes are skipped without renumbering present items. */
function renderSparseFor() {
  const sparse = new Array(3);
  sparse[2] = 'Three';
  return createComponent(For, {
    each: sparse,
    fallback: 'Hidden fallback',
    /** Render the original array position of one present item. */
    children: (item, index) => `${index()}:${item}`,
  });
}

assert.equal(renderToString(renderAbsentFor), '');
assert.equal(renderToString(renderSparseFor), '2:Three');
console.log('Packed For server rendering passed.');
