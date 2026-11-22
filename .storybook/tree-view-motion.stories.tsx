import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { TreeView, createTreeCollection } from '../src/components/tree-view-exports';

interface Entry {
  id: string;
  name: string;
  children?: Entry[];
}

const collection = createTreeCollection<Entry>({
  nodeToValue:
    /** Keep expanded values stable between media modes. */
    (node) => node.id,
  nodeToString:
    /** Give the branch and leaf accessible names. */
    (node) => node.name,
  rootNode: {
    id: 'root',
    name: 'Files',
    children: [{ id: 'folder', name: 'Folder', children: [{ id: 'file', name: 'File' }] }],
  },
});

/** Render the branch's selectable control. */
function renderBranch({ node }: TreeView.NodeRenderProps<Entry>): JSX.Element {
  return (
    <TreeView.BranchControl data-testid="motion-branch">
      <TreeView.BranchText>{node.name}</TreeView.BranchText>
    </TreeView.BranchControl>
  );
}

/** Render the descendant shown by the open branch. */
function renderLeaf({ node }: TreeView.NodeRenderProps<Entry>): JSX.Element {
  return (
    <TreeView.Item data-testid="motion-leaf">
      <TreeView.ItemText>{node.name}</TreeView.ItemText>
    </TreeView.Item>
  );
}

/** Exercise the animation under browser motion preferences. */
function MotionTree(): JSX.Element {
  return (
    <>
      <TreeView.Root collection={collection} animateContent defaultExpandedValue={['folder']}>
        <TreeView.Label>Motion files</TreeView.Label>
        <TreeView.Tree>
          <TreeView.Node<Entry> render={renderLeaf} renderBranch={renderBranch} />
        </TreeView.Tree>
      </TreeView.Root>
    </>
  );
}

const meta = {
  title: 'Components/Tree View Motion',
  component: MotionTree,
} satisfies Meta<typeof MotionTree>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
