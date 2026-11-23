import { type JSX } from '@solidjs/web';
import { FileIcon, FolderIcon, SquareMinusIcon, SquarePlusIcon } from '@lucide/solid';
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

/** Bind a checkmark to the current node's machine-owned checked state. */
function ExplorerCheckbox(): JSX.Element {
  const node = useTreeViewNodeContext();
  return (
    <TreeView.NodeCheckbox aria-label="check node">
      <Checkmark
        size="sm"
        checked={node().checked === true}
        indeterminate={node().checked === 'indeterminate'}
      />
    </TreeView.NodeCheckbox>
  );
}

/** Show a tree with expanded folders for the anatomy explorer. */
export function TreeViewExplorerDemo(): JSX.Element {
  return (
    <TreeView.Root
      collection={collection}
      style={{ 'max-width': 'var(--lui-sizes-sm)' }}
      defaultExpandedValue={['node_modules', 'node_modules/@types', 'src']}
      defaultCheckedValue={[]}
    >
      <TreeView.Label
        style={{
          'margin-bottom': 'var(--lui-spacing-2)',
          'font-weight': 'var(--lui-font-weights-medium)',
        }}
      >
        Project explorer
      </TreeView.Label>
      <TreeView.Tree>
        <TreeView.Node<TreeNode>
          indentGuide={() => <TreeView.BranchIndentGuide />}
          render={
            /** Render a row with every anatomy part the explorer can highlight. */
            ({ node, nodeState }) =>
              nodeState().isBranch ? (
                <TreeView.BranchControl>
                  <TreeView.BranchTrigger>
                    {nodeState().expanded ? <SquareMinusIcon /> : <SquarePlusIcon />}
                  </TreeView.BranchTrigger>
                  <ExplorerCheckbox />
                  <FolderIcon />
                  <TreeView.BranchText>{node.name}</TreeView.BranchText>
                  <TreeView.BranchIndicator />
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item>
                  <ExplorerCheckbox />
                  <FileIcon />
                  <TreeView.ItemText>{node.name}</TreeView.ItemText>
                  <TreeView.ItemIndicator />
                </TreeView.Item>
              )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
}
