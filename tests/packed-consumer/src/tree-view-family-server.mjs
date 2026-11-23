import assert from 'node:assert/strict';
import { TreeView, createTreeCollection, useTreeView } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { JSDOM } from 'jsdom';

const leaf = { id: 'file', name: 'File.txt' };
const collection = createTreeCollection({
  nodeToValue:
    /** Keep installed server machine values stable. */
    (node) => node.id,
  nodeToString:
    /** Give the installed item its accessible text. */
    (node) => node.name,
  rootNode: { id: 'root', name: 'Files', children: [leaf] },
});

/** Render the installed leaf and its public styled text part. */
function renderLeaf() {
  return createComponent(TreeView.NodeProvider, {
    node: leaf,
    indexPath: [0],
    /** Keep item styling inside the primitive's node context. */
    get children() {
      return createComponent(TreeView.Item, {
        /** Keep the accessible name inside the item part. */
        get children() {
          return createComponent(TreeView.ItemText, { children: leaf.name });
        },
      });
    },
  });
}

/** Render the published server entry with a caller-owned tree machine. */
function renderInstalledTree() {
  return renderToString(
    /** Create the primitive's external machine under one server request owner. */
    () => {
      const machine = useTreeView({ collection, defaultSelectedValue: ['file'] });
      return createComponent(TreeView.RootProvider, {
        value: machine,
        size: 'sm',
        /** Compose the label and selected item under the machine. */
        get children() {
          return [
            createComponent(TreeView.Label, { children: 'Installed files' }),
            createComponent(TreeView.Tree, {
              /** Bind the leaf to its collection index path. */
              get children() {
                return renderLeaf();
              },
            }),
          ];
        },
      });
    },
  );
}

/** Confirm the installed markup retains the primitive ARIA and Lever UI classes. */
function verifyInstalledMarkup(markup) {
  const window = new JSDOM(markup).window;
  try {
    const document = window.document;
    // Zag 2 renders the tree as a grid with one gridcell per row.
    const tree = document.querySelector('[role="treegrid"]');
    const label = document.querySelector('[data-tree-view-label]');
    const item = document.querySelector('[role="row"]');
    assert.ok(tree);
    assert.ok(label);
    assert.ok(item);
    assert.equal(tree.getAttribute('aria-labelledby'), label.id);
    assert.equal(item.getAttribute('aria-selected'), 'true');
    assert.match(item.className, /lui-tree-view__item/);
  } finally {
    window.close();
  }
}

const markup = renderInstalledTree();
assert.match(markup, /lui-tree-view__root/);
verifyInstalledMarkup(markup);
console.log('Packed Tree View server rendering passed.');
