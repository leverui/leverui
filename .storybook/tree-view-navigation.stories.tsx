import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { TreeView, createTreeCollection } from '../src/components/tree-view-exports';

interface Entry {
  id: string;
  name: string;
  href?: string;
  children?: Entry[];
}

const collection = createTreeCollection<Entry>({
  nodeToValue:
    /** Keep keyboard and selection state attached to stable values. */
    (node) => node.id,
  nodeToString:
    /** Supply typeahead with each node's accessible name. */
    (node) => node.name,
  rootNode: {
    id: 'root',
    name: 'Files',
    children: [
      {
        id: 'folder',
        name: 'Folder',
        children: [
          { id: 'alpha', name: 'Alpha', href: '#tree-destination' },
          { id: 'beta', name: 'Beta' },
        ],
      },
      { id: 'gamma', name: 'Gamma' },
    ],
  },
});

/** Render a linked or plain leaf with the primitive's native row props. */
function renderLeaf({ node }: TreeView.NodeRenderProps<Entry>): JSX.Element {
  if (node.href) {
    return (
      <TreeView.Item
        data-testid={`navigation-${node.id}`}
        asChild={
          /** Keep the link destination and the primitive's merged native attributes. */
          (getProps) => <a href={node.href} {...getProps()} />
        }
      >
        <TreeView.ItemText>{node.name}</TreeView.ItemText>
      </TreeView.Item>
    );
  }
  return (
    <TreeView.Item data-testid={`navigation-${node.id}`}>
      <TreeView.ItemText>{node.name}</TreeView.ItemText>
    </TreeView.Item>
  );
}

/** Keep explicit expansion separate from branch selection. */
function renderBranch({ node }: TreeView.NodeRenderProps<Entry>): JSX.Element {
  return (
    <TreeView.BranchControl data-testid={`navigation-${node.id}`}>
      <TreeView.BranchTrigger data-testid="navigation-trigger">
        <TreeView.BranchIndicator>▸</TreeView.BranchIndicator>
      </TreeView.BranchTrigger>
      <TreeView.BranchText>{node.name}</TreeView.BranchText>
    </TreeView.BranchControl>
  );
}

/** Exercise links, multiple selection, and native tree keyboard paths. */
function NavigationTree(): JSX.Element {
  const [selected, setSelected] = createSignal<string[]>([]);
  return (
    <>
      <output data-testid="navigation-selected">{selected().join(',')}</output>
      <TreeView.Root
        collection={collection}
        selectionMode="multiple"
        expandOnClick={false}
        defaultExpandedValue={['folder']}
        onSelectionChange={
          /** Publish the machine's selected values for browser assertions. */
          (details) => setSelected(details.selectedValue)
        }
      >
        <TreeView.Label>Navigation files</TreeView.Label>
        <TreeView.Tree>
          <TreeView.Node<Entry> render={renderLeaf} renderBranch={renderBranch} />
        </TreeView.Tree>
      </TreeView.Root>
      <div id="tree-destination">Destination</div>
    </>
  );
}

const meta = {
  title: 'Components/Tree View Navigation',
  component: NavigationTree,
} satisfies Meta<typeof NavigationTree>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
