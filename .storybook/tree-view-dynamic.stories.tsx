import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import {
  TreeView,
  createTreeCollection,
  type TreeCollection,
} from '../src/components/tree-view-exports';

interface Entry {
  id: string;
  name: string;
  children?: Entry[];
  childrenCount?: number;
}

/** Create a collection with one asynchronous branch and one static leaf. */
function initialCollection(): TreeCollection<Entry> {
  return createTreeCollection<Entry>({
    nodeToValue:
      /** Keep machine state attached to each node's stable value. */
      (node) => node.id,
    nodeToString:
      /** Give each node an accessible name. */
      (node) => node.name,
    rootNode: {
      id: 'root',
      name: 'Files',
      children: [
        { id: 'folder', name: 'Folder', childrenCount: 1 },
        { id: 'readme', name: 'Readme' },
      ],
    },
  });
}

/** Render a leaf under its primitive node provider. */
function renderLeaf({ node }: TreeView.NodeRenderProps<Entry>): JSX.Element {
  return (
    <TreeView.Item data-testid={`dynamic-tree-${node.id}`}>
      <TreeView.ItemText>{node.name}</TreeView.ItemText>
    </TreeView.Item>
  );
}

/** Render loading and expansion state on the branch control. */
function renderBranch({ node, nodeState }: TreeView.NodeRenderProps<Entry>): JSX.Element {
  return (
    <TreeView.BranchControl data-testid={`dynamic-tree-${node.id}`}>
      <TreeView.BranchIndicator>{nodeState().loading ? '…' : '▸'}</TreeView.BranchIndicator>
      <TreeView.BranchText>{node.name}</TreeView.BranchText>
    </TreeView.BranchControl>
  );
}

/** Exercise the primitive's async loader and collection mutation through the public root. */
function DynamicTree(): JSX.Element {
  const [collection, setCollection] = createSignal(initialCollection());

  /** Add a nested leaf with the collection's immutable replace operation. */
  function addNode(): void {
    setCollection(
      /** Update the current branch without replacing its machine root. */
      (current) => {
        const folder = current.getNodeChildren(current.rootNode)[0];
        if (!folder) throw new Error('The dynamic tree lost its folder.');
        return current.replace([0], {
          ...folder,
          children: [...current.getNodeChildren(folder), { id: 'added', name: 'Added' }],
        });
      },
    );
  }

  /** Keep only the asynchronously loaded leaf and its ancestor. */
  function filterNodes(): void {
    setCollection(
      /** Return a new filtered collection while retaining the tree machine. */
      (current) =>
        current.filter(
          /** Retain the loaded leaf and its ancestor branch. */
          (node) => node.id === 'loaded',
        ),
    );
  }

  return (
    <>
      <button data-testid="dynamic-tree-add" onClick={addNode}>
        Add node
      </button>
      <button data-testid="dynamic-tree-filter" onClick={filterNodes}>
        Filter nodes
      </button>
      <TreeView.Root
        collection={collection()}
        loadChildren={
          /** Resolve a branch after the primitive requests its descendants. */
          () => Promise.resolve([{ id: 'loaded', name: 'Loaded' }])
        }
        onLoadChildrenComplete={
          /** Publish Zag's updated collection to the Solid root. */
          (details) => setCollection(details.collection)
        }
      >
        <TreeView.Label>Dynamic files</TreeView.Label>
        <TreeView.Tree>
          <TreeView.Node<Entry> render={renderLeaf} renderBranch={renderBranch} />
        </TreeView.Tree>
      </TreeView.Root>
    </>
  );
}

const meta = {
  title: 'Components/Tree View Dynamic',
  component: DynamicTree,
} satisfies Meta<typeof DynamicTree>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
