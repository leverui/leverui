import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { createSignal, flush } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { afterEach, expect, it } from 'vitest';
import { createTreeCollection, type TreeCollection } from './tree-view-machine';
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

interface Entry {
  id: string;
  name: string;
  children?: Entry[];
}

const folder: Entry = {
  id: 'folder',
  name: 'Folder',
  children: [{ id: 'first', name: 'First' }],
};
const readme: Entry = { id: 'readme', name: 'Readme' };

/** Build a collection that keeps node values independent of position. */
function collectionFor(children: Entry[]): TreeCollection<Entry> {
  return createTreeCollection<Entry>({
    nodeToValue:
      /** Preserve machine values when nodes move. */
      (node) => node.id,
    nodeToString:
      /** Give every node a stable accessible name. */
      (node) => node.name,
    rootNode: { id: 'root', name: 'Files', children },
  });
}

/** Render nested leaves with their current collection paths. */
function renderLeaf({ node, indexPath }: TreeViewNodeRenderProps<Entry>): JSX.Element {
  return (
    <TreeViewItem data-testid={`dynamic-${node.id}`} data-path={indexPath.join('.')}>
      <TreeViewItemText>{node.name}</TreeViewItemText>
    </TreeViewItem>
  );
}

/** Render an expandable branch with its current collection path. */
function renderBranch({ node, indexPath }: TreeViewNodeRenderProps<Entry>): JSX.Element {
  return (
    <TreeViewBranchControl data-testid={`dynamic-${node.id}`} data-path={indexPath.join('.')}>
      <TreeViewBranchText>{node.name}</TreeViewBranchText>
    </TreeViewBranchControl>
  );
}

/** Verify nested mutation and filtering through the recursive public helper. */
async function verifiesNestedCollectionChanges(): Promise<void> {
  const initial = collectionFor([folder, readme]);
  const [collection, setCollection] = createSignal(initial);
  render(
    /** Keep the root mounted while its collection changes. */
    () => (
      <>
        <TreeViewRoot collection={collection()} defaultExpandedValue={['folder']}>
          <TreeViewTree>
            <TreeViewNode<Entry> render={renderLeaf} renderBranch={renderBranch} />
          </TreeViewTree>
        </TreeViewRoot>
      </>
    ),
  );
  expect(screen.getByTestId('dynamic-first')).toHaveAttribute('data-path', '0.0');
  setCollection(
    /** Replace one nested leaf without remounting the machine root. */
    (current) => current.replace([0, 0], { id: 'second', name: 'Second' }),
  );
  flush();
  await waitFor(
    /** Wait for the primitive's collection and node providers to publish the replacement. */
    () => expect(screen.getByTestId('dynamic-second')).toHaveAttribute('data-path', '0.0'),
  );
  expect(screen.queryByTestId('dynamic-first')).toBeNull();

  setCollection(
    /** Keep only the matching nested branch and its ancestor. */
    (current) => current.filter((node) => node.id === 'second'),
  );
  flush();
  await waitFor(
    /** Wait for the filtered root children to update. */
    () => expect(screen.queryByTestId('dynamic-readme')).toBeNull(),
  );
  expect(screen.getByTestId('dynamic-second')).toHaveAttribute('data-path', '0.0');
}

it('updates nested branch nodes after mutation and filtering', verifiesNestedCollectionChanges);

/** Verify moving a reused branch updates its and its child's index paths. */
async function verifiesReorderedPaths(): Promise<void> {
  const [collection, setCollection] = createSignal(collectionFor([folder, readme]));
  render(
    /** Keep the same node objects while their collection positions change. */
    () => (
      <>
        <TreeViewRoot collection={collection()} defaultExpandedValue={['folder']}>
          <TreeViewTree>
            <TreeViewNode<Entry> render={renderLeaf} renderBranch={renderBranch} />
          </TreeViewTree>
        </TreeViewRoot>
      </>
    ),
  );
  setCollection(collectionFor([readme, folder]));
  flush();
  await waitFor(
    /** Observe the moved branch's new machine path. */
    () => expect(screen.getByTestId('dynamic-folder')).toHaveAttribute('data-path', '1'),
  );
  expect(screen.getByTestId('dynamic-first')).toHaveAttribute('data-path', '1.0');
}

it('keeps node paths aligned when existing nodes reorder', verifiesReorderedPaths);

/** Render both node kinds from one callback; the branch reads state in its JSX. */
function renderByState({
  node,
  indexPath,
  nodeState,
}: TreeViewNodeRenderProps<Entry>): JSX.Element {
  if (!nodeState().isBranch) return renderLeaf({ node, indexPath, nodeState });
  return (
    <TreeViewBranchControl data-testid={`dynamic-${node.id}`} data-path={indexPath.join('.')}>
      <TreeViewBranchText>{node.name}</TreeViewBranchText>
      <span data-testid={`state-${node.id}`}>{nodeState().expanded ? 'open' : 'closed'}</span>
    </TreeViewBranchControl>
  );
}

/** Verify reading node state in a renderer does not rebuild the row. */
async function verifiesStableRow(): Promise<void> {
  render(
    /** Mount a single-callback tree whose branch can expand. */
    () => (
      <>
        <TreeViewRoot collection={collectionFor([folder])}>
          <TreeViewTree>
            <TreeViewNode<Entry> render={renderByState} />
          </TreeViewTree>
        </TreeViewRoot>
      </>
    ),
  );
  const row = screen.getByTestId('dynamic-folder');
  expect(screen.getByTestId('state-folder')).toHaveTextContent('closed');
  fireEvent.click(row);
  await waitFor(
    /** Wait for the machine to publish the expanded branch. */
    () => expect(row.closest('[role="row"]')).toHaveAttribute('aria-expanded', 'true'),
  );
  expect(screen.getByTestId('dynamic-folder')).toBe(row);
  expect(screen.getByTestId('state-folder')).toHaveTextContent('open');
}

it('keeps a row mounted while state read in its JSX still updates', verifiesStableRow);
