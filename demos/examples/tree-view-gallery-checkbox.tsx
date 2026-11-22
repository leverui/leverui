import { type JSX } from '@solidjs/web';
import { FileIcon, FolderIcon } from '@lucide/solid';
import { Checkmark, TreeView, createTreeCollection, useTreeViewNodeContext } from '../../src';

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

const collection = createTreeCollection<TreeNode>({
  nodeToValue:
    /** Give every tree item the stable machine value. */
    (node) => node.id,
  nodeToString:
    /** Give every tree item its visible accessible label. */
    (node) => node.name,
  rootNode: {
    id: 'ROOT',
    name: '',
    children: [
      {
        id: 'node_modules',
        name: 'node_modules',
        children: [
          { id: 'node_modules/solid-js', name: 'solid-js' },
          { id: 'node_modules/vite', name: 'vite' },
          {
            id: 'node_modules/@types',
            name: '@types',
            children: [
              { id: 'node_modules/@types/react', name: 'react' },
              { id: 'node_modules/@types/react-dom', name: 'react-dom' },
            ],
          },
        ],
      },
      {
        id: 'src',
        name: 'src',
        children: [
          { id: 'src/app.tsx', name: 'app.tsx' },
          { id: 'src/index.ts', name: 'index.ts' },
        ],
      },
      { id: 'vite.config', name: 'vite.config.ts' },
      { id: 'package.json', name: 'package.json' },
      { id: 'renovate.json', name: 'renovate.json' },
      { id: 'readme.md', name: 'README.md' },
    ],
  },
});

/** Bind the public Checkmark CSS appearance to the current Tree View node's checked state. */
function NodeCheckmark(): JSX.Element {
  const node = useTreeViewNodeContext();
  return (
    <TreeView.NodeCheckbox aria-label="check node">
      <Checkmark
        size="sm"
        checked={node().checked === true}
        indeterminate={node().checked === 'indeterminate'}
        style={{
          background: node().checked
            ? 'var(--leverui-colors-color-palette-solid)'
            : 'var(--leverui-colors-bg)',
        }}
      />
    </TreeView.NodeCheckbox>
  );
}

/** Show parent, child, and indeterminate check states. */
export function TreeViewCheckboxTree(): JSX.Element {
  return (
    <TreeView.Root
      collection={collection}
      style={{ 'max-width': 'var(--leverui-sizes-sm)' }}
      defaultCheckedValue={[]}
    >
      <TreeView.Label>Project files</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Node<TreeNode>
          render={
            /** Render a selectable folder or file beside its machine-owned checkbox. */
            ({ node, nodeState }) =>
              nodeState().isBranch ? (
                <TreeView.BranchControl>
                  <NodeCheckmark />
                  <FolderIcon />
                  <TreeView.BranchText>{node.name}</TreeView.BranchText>
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item>
                  <NodeCheckmark />
                  <FileIcon />
                  <TreeView.ItemText>{node.name}</TreeView.ItemText>
                </TreeView.Item>
              )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
}
