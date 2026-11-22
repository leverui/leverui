import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { TreeView, createTreeCollection, useTreeView } from '../src/components/tree-view-exports';

interface FileNode {
  id: string;
  name: string;
  children?: FileNode[];
}

const collection = createTreeCollection<FileNode>({
  nodeToValue:
    /** Keep machine values stable across collection updates. */
    (node) => node.id,
  nodeToString:
    /** Give each node an accessible text name. */
    (node) => node.name,
  rootNode: {
    id: 'root',
    name: 'Files',
    children: [
      {
        id: 'src',
        name: 'Source',
        children: [
          { id: 'src/app', name: 'App.tsx' },
          { id: 'src/index', name: 'index.ts' },
        ],
      },
      { id: 'readme', name: 'README.md' },
    ],
  },
});

/** Render a leaf using the primitive's selected and focused item attributes. */
function renderLeaf({ node }: TreeView.NodeRenderProps<FileNode>): JSX.Element {
  return (
    <TreeView.Item data-testid={`tree-item-${node.id}`}>
      <TreeView.ItemIndicator>•</TreeView.ItemIndicator>
      <TreeView.ItemText>{node.name}</TreeView.ItemText>
    </TreeView.Item>
  );
}

/** Render a branch control and its live expansion indicator. */
function renderBranch({ node, nodeState }: TreeView.NodeRenderProps<FileNode>): JSX.Element {
  return (
    <TreeView.BranchControl data-testid={`tree-branch-${node.id}`}>
      <TreeView.BranchIndicator>{nodeState().expanded ? '▾' : '▸'}</TreeView.BranchIndicator>
      <TreeView.BranchText>{node.name}</TreeView.BranchText>
    </TreeView.BranchControl>
  );
}

/** Compose the recursive public Node helper inside the tree. */
function FileTree(): JSX.Element {
  return (
    <>
      <TreeView.Label>Project files</TreeView.Label>
      <TreeView.Tree data-testid="tree-items">
        <TreeView.Node<FileNode>
          render={renderLeaf}
          renderBranch={renderBranch}
          indentGuide={
            /** Create a fresh native guide for each expanded branch. */
            () => <TreeView.BranchIndentGuide />
          }
        />
      </TreeView.Tree>
    </>
  );
}

/** Exercise controlled selection, expansion, and reactive CSS variants. */
function ContractTree(): JSX.Element {
  const [selected, setSelected] = createSignal<string[]>([]);
  const [expanded, setExpanded] = createSignal<string[]>(['src']);
  const [size, setSize] = createSignal<'md' | 'sm'>('md');
  const [variant, setVariant] = createSignal<'subtle' | 'solid'>('subtle');
  return (
    <>
      <button
        data-testid="tree-size"
        onClick={
          /** Toggle the size while preserving native tree nodes. */
          () => setSize(size() === 'md' ? 'sm' : 'md')
        }
      >
        Toggle size
      </button>
      <button
        data-testid="tree-variant"
        onClick={
          /** Toggle the selected-state CSS appearance without touching machine state. */
          () => setVariant(variant() === 'subtle' ? 'solid' : 'subtle')
        }
      >
        Toggle variant
      </button>
      <output data-testid="tree-selected">{selected().join(',')}</output>
      <output data-testid="tree-expanded">{expanded().join(',')}</output>
      <TreeView.Root
        collection={collection}
        selectedValue={selected()}
        expandedValue={expanded()}
        onSelectionChange={
          /** Keep selection synchronized with the caller's Solid signal. */
          (details) => setSelected(details.selectedValue)
        }
        onExpandedChange={
          /** Keep expansion synchronized with the caller's Solid signal. */
          (details) => setExpanded(details.expandedValue)
        }
        size={size()}
        variant={variant()}
        data-testid="tree-root"
      >
        <FileTree />
      </TreeView.Root>
    </>
  );
}

/** Exercise a caller-owned primitive machine beneath a styled root provider. */
function ProviderTree(): JSX.Element {
  const machine = useTreeView({ collection, defaultExpandedValue: ['src'] });
  return (
    <>
      <TreeView.RootProvider value={machine} size="sm" data-testid="tree-provider">
        <FileTree />
        <output data-testid="tree-provider-selection">{machine().selectedValue.join(',')}</output>
      </TreeView.RootProvider>
    </>
  );
}

/** Show static breakpoint styling without runtime media listeners. */
function ResponsiveTree(): JSX.Element {
  return (
    <>
      <TreeView.Root
        collection={collection}
        size={{ base: 'xs', md: 'sm' }}
        variant={{ base: 'subtle', md: 'solid' }}
        defaultExpandedValue={['src']}
        defaultSelectedValue={['src/app']}
        data-testid="tree-responsive-root"
      >
        <FileTree />
      </TreeView.Root>
    </>
  );
}

const meta = { title: 'Components/Tree View', component: ContractTree } satisfies Meta<
  typeof ContractTree
>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
export const Provider: Story = { render: ProviderTree };
export const Responsive: Story = { render: ResponsiveTree };
