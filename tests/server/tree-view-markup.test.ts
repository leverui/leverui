import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type {
  TreeViewItem as ItemExport,
  TreeViewItemText as ItemTextExport,
  TreeViewLabel as LabelExport,
  TreeViewNodeProvider as NodeProviderExport,
  TreeViewRoot as RootExport,
  TreeViewTree as TreeExport,
  createTreeCollection as CollectionExport,
} from '../../src/components/tree-view-exports';

interface FileNode {
  id: string;
  name: string;
  children?: FileNode[];
}

type ServerComponents = {
  TreeViewItem: typeof ItemExport;
  TreeViewItemText: typeof ItemTextExport;
  TreeViewLabel: typeof LabelExport;
  TreeViewNodeProvider: typeof NodeProviderExport;
  TreeViewRoot: typeof RootExport;
  TreeViewTree: typeof TreeExport;
  createTreeCollection: typeof CollectionExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the published Tree View parts under one primitive node context. */
function renderServerTree(): string {
  const collection = server.createTreeCollection<FileNode>({
    nodeToValue:
      /** Give the server machine a stable node value. */
      (node) => node.id,
    nodeToString:
      /** Give its tree item an accessible name. */
      (node) => node.name,
    rootNode: { id: 'root', name: 'Files', children: [{ id: 'readme', name: 'README.md' }] },
  });
  const node = collection.getNodeChildren(collection.rootNode)[0];
  if (!node) throw new Error('The Tree View server fixture has no item.');

  return renderToString(
    /** Scope the published machine and recipe to one server request. */
    () =>
      createComponent(server.TreeViewRoot, {
        collection,
        defaultSelectedValue: ['readme'],
        /** Compose the native label and tree after the primitive's root context. */
        get children(): JSX.Element {
          return [
            createComponent(server.TreeViewLabel, { children: 'Project files' }),
            createComponent(server.TreeViewTree, {
              /** Bind the leaf to its collection index path. */
              get children(): JSX.Element {
                return createComponent(server.TreeViewNodeProvider, {
                  node,
                  indexPath: [0],
                  /** Render the selected item under its node context. */
                  get children(): JSX.Element {
                    return createComponent(server.TreeViewItem, {
                      /** Preserve its styled, accessible text part. */
                      get children(): JSX.Element {
                        return createComponent(server.TreeViewItemText, {
                          children: node.name,
                        });
                      },
                    });
                  },
                });
              },
            }),
          ];
        },
      }),
  );
}

/** Confirm server markup retains the primitive roles and Lever UI slot classes. */
function verifiesPublishedTree(): void {
  const markup = renderServerTree();
  // The primitive renders the tree as a grid of rows.
  expect(markup).toContain('role="treegrid"');
  expect(markup).toContain('role="row"');
  expect(markup).toContain('aria-selected="true"');
  expect(markup).toContain('leverui-tree-view__root');
  expect(markup).toContain('leverui-tree-view__item');
  expect(markup).toContain('README.md');
}

test('published Tree View renders selected accessible markup', verifiesPublishedTree);
