import { type JSX } from '@solidjs/web';
import { SquareMinusIcon, SquarePlusIcon } from '@lucide/solid';
import { TreeView, createTreeCollection } from '../../src';
import './tree-view-gallery-expansion.css';

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

/** Show plus and minus icons without leaf icons. */
export function TreeViewExpandIcon(): JSX.Element {
  return (
    <TreeView.Root collection={collection} style={{ 'max-width': 'var(--leverui-sizes-sm)' }}>
      <TreeView.Label>Project files</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Node<TreeNode>
          render={
            /** Render a folder with a plus or minus state icon, and a text-only file row. */
            ({ node, nodeState }) =>
              nodeState().isBranch ? (
                <TreeView.BranchControl>
                  {nodeState().expanded ? <SquareMinusIcon /> : <SquarePlusIcon />}
                  <TreeView.BranchText>{node.name}</TreeView.BranchText>
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item>{node.name}</TreeView.Item>
              )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
}

/** Tint expanded folders and use plus and minus state icons. */
export function TreeViewExpandedStyling(): JSX.Element {
  return (
    <TreeView.Root
      collection={collection}
      style={{ 'max-width': 'var(--leverui-sizes-sm)' }}
      variant="solid"
      colorPalette="teal"
      defaultExpandedValue={['node_modules']}
    >
      <TreeView.Label>Project files</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Node<TreeNode>
          branchProps={{ class: 'tree-view-gallery-expanded-branch' }}
          render={
            /** Render a folder with a plus or minus state icon, and a text-only file row. */
            ({ node, nodeState }) =>
              nodeState().isBranch ? (
                <TreeView.BranchControl>
                  {nodeState().expanded ? <SquareMinusIcon /> : <SquarePlusIcon />}
                  <TreeView.BranchText>{node.name}</TreeView.BranchText>
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item>{node.name}</TreeView.Item>
              )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
}
