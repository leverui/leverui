import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createMemo, createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { createTreeCollection } from './tree-view-machine';
import type { TreeViewNodeRenderProps } from './tree-view-node';
import { TreeViewNode } from './tree-view-node';
import {
  TreeViewBranchControl,
  TreeViewBranchText,
  TreeViewItem,
  TreeViewItemText,
  TreeViewTree,
} from './tree-view-parts';
import { TreeViewRoot } from './tree-view-root';

afterEach(cleanup);

interface FileNode {
  id: string;
  name: string;
  children?: FileNode[];
}

const collection = createTreeCollection<FileNode>({
  nodeToValue:
    /** Keep each machine value stable across renders. */
    (node) => node.id,
  nodeToString:
    /** Give every node an accessible text value. */
    (node) => node.name,
  rootNode: {
    id: 'root',
    name: 'Files',
    children: [
      { id: 'src', name: 'Source', children: [{ id: 'app', name: 'App.tsx' }] },
      { id: 'readme', name: 'README.md' },
    ],
  },
});

/** Render only leaves as the primitive items inside the recursive helper. */
function renderLeaf({ node }: TreeViewNodeRenderProps<FileNode>): JSX.Element {
  return (
    <TreeViewItem data-testid={`item-${node.id}`}>
      <TreeViewItemText>{node.name}</TreeViewItemText>
    </TreeViewItem>
  );
}

/** Render only branches as the primitive controls inside the recursive helper. */
function renderBranch({ node }: TreeViewNodeRenderProps<FileNode>): JSX.Element {
  return (
    <TreeViewBranchControl data-testid={`branch-${node.id}`}>
      <TreeViewBranchText>{node.name}</TreeViewBranchText>
    </TreeViewBranchControl>
  );
}

/** Verify recursive contexts and native selection without a custom machine. */
async function verifiesRecursiveNode(): Promise<void> {
  render(
    /** Mount the primitive state under the matching Lever UI recipe provider. */
    () => (
      <>
        <TreeViewRoot collection={collection} defaultExpandedValue={['src']}>
          <TreeViewTree>
            <TreeViewNode<FileNode> render={renderLeaf} renderBranch={renderBranch} />
          </TreeViewTree>
        </TreeViewRoot>
      </>
    ),
  );
  expect(screen.getByTestId('branch-src')).toHaveAttribute('data-state', 'open');
  expect(screen.getByTestId('item-app')).toHaveAttribute('role', 'row');
  expect(screen.getByTestId('item-readme')).toHaveAttribute('role', 'row');
  expect(screen.queryByTestId('item-src')).toBeNull();
  fireEvent.click(screen.getByTestId('item-app'));
  await waitFor(
    /** Wait for the Zag machine to publish the selected node state. */
    () => expect(screen.getByTestId('item-app')).toHaveAttribute('aria-selected', 'true'),
  );
}

it(
  'recurses through branch and leaf contexts without duplicating renderers',
  verifiesRecursiveNode,
);

/** Verify collection replacements update the rendered tree without remounting the root. */
async function verifiesReactiveCollection(): Promise<void> {
  const [nodes, setNodes] = createSignal<FileNode[]>([{ id: 'first', name: 'First' }]);

  /** Keep the primitive collection reactive to replacement source nodes. */
  function DynamicTree(): JSX.Element {
    const currentCollection = createMemo(
      /** Build a primitive collection for the current source nodes. */
      () =>
        createTreeCollection<FileNode>({
          nodeToValue:
            /** Keep each machine value stable across collection replacements. */
            (node) => node.id,
          nodeToString:
            /** Give replaced nodes an accessible text value. */
            (node) => node.name,
          rootNode: { id: 'root', name: 'Files', children: nodes() },
        }),
    );
    return (
      <>
        <TreeViewRoot collection={currentCollection()}>
          <TreeViewTree>
            <TreeViewNode<FileNode> render={renderLeaf} />
          </TreeViewTree>
        </TreeViewRoot>
      </>
    );
  }

  render(DynamicTree);
  expect(screen.getByTestId('item-first')).toHaveAttribute('role', 'row');
  setNodes([{ id: 'second', name: 'Second' }]);
  flush();
  await waitFor(
    /** Wait for the collection and the primitive contexts to publish the new node. */
    () => expect(screen.getByTestId('item-second')).toHaveAttribute('role', 'row'),
  );
  expect(screen.queryByTestId('item-first')).toBeNull();
}

it('updates rendered nodes when the collection changes', verifiesReactiveCollection);
