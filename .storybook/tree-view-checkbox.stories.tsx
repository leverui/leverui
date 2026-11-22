import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { TreeView, createTreeCollection } from '../src/components/tree-view-exports';

interface CheckNode {
  id: string;
  name: string;
  disabled?: boolean;
  children?: CheckNode[];
}

const collection = createTreeCollection<CheckNode>({
  nodeToValue:
    /** Keep checkbox state attached to a stable node value. */
    (node) => node.id,
  nodeToString:
    /** Give each checkbox tree item an accessible name. */
    (node) => node.name,
  isNodeDisabled:
    /** Prevent the locked leaf from changing selection or checked state. */
    (node) => node.disabled === true,
  rootNode: {
    id: 'root',
    name: 'Files',
    children: [
      {
        id: 'folder',
        name: 'Folder',
        children: [
          { id: 'file', name: 'Editable file' },
          { id: 'locked', name: 'Locked file', disabled: true },
        ],
      },
    ],
  },
});

/** Render the machine checkbox and its three visible states. */
function Checkmark(props: { node: CheckNode }): JSX.Element {
  return (
    <TreeView.NodeCheckbox
      aria-label={`Check ${props.node.name}`}
      data-testid={`tree-check-${props.node.id}`}
    >
      <TreeView.NodeCheckboxIndicator fallback="□" indeterminate="−">
        ✓
      </TreeView.NodeCheckboxIndicator>
    </TreeView.NodeCheckbox>
  );
}

/** Render one leaf with a checkbox and the primitive's native row state. */
function renderLeaf({ node }: TreeView.NodeRenderProps<CheckNode>): JSX.Element {
  return (
    <TreeView.Item data-testid={`tree-checkbox-item-${node.id}`}>
      <Checkmark node={node} />
      <TreeView.ItemText>{node.name}</TreeView.ItemText>
    </TreeView.Item>
  );
}

/** Render one expandable branch with a parent checkbox. */
function renderBranch({ node }: TreeView.NodeRenderProps<CheckNode>): JSX.Element {
  return (
    <TreeView.BranchControl data-testid={`tree-checkbox-branch-${node.id}`}>
      <Checkmark node={node} />
      <TreeView.BranchIndicator>▸</TreeView.BranchIndicator>
      <TreeView.BranchText>{node.name}</TreeView.BranchText>
    </TreeView.BranchControl>
  );
}

/** Exercise checkbox and disabled-node behavior through public parts. */
function CheckboxTree(): JSX.Element {
  return (
    <>
      <TreeView.Root collection={collection} defaultExpandedValue={['folder']}>
        <TreeView.Label>Selectable files</TreeView.Label>
        <TreeView.Tree>
          <TreeView.Node<CheckNode> render={renderLeaf} renderBranch={renderBranch} />
        </TreeView.Tree>
      </TreeView.Root>
    </>
  );
}

const meta = {
  title: 'Components/Tree View Checkbox',
  component: CheckboxTree,
} satisfies Meta<typeof CheckboxTree>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
