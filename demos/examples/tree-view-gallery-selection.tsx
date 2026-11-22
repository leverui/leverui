import { type JSX } from '@solidjs/web';
import { FileIcon, FolderIcon } from '@lucide/solid';
import { TreeView, createTreeCollection, useTreeView } from '../../src';

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

/** Permit additive selection of several files. */
export function TreeViewMultiSelect(): JSX.Element {
  return (
    <TreeView.Root collection={collection} selectionMode="multiple">
      <TreeView.Label>Project files</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Node<TreeNode>
          indentGuide={() => <TreeView.BranchIndentGuide />}
          render={
            /** Render a folder control or a file row. */
            ({ node, nodeState }) =>
              nodeState().isBranch ? (
                <TreeView.BranchControl>
                  <FolderIcon />
                  <TreeView.BranchText>{node.name}</TreeView.BranchText>
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item>
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

/** Expose the caller-owned machine's expanded values above the tree. */
export function TreeViewStore(): JSX.Element {
  const store = useTreeView({ collection, defaultExpandedValue: [] });
  return (
    <TreeView.RootProvider value={store}>
      <TreeView.Label>Project files</TreeView.Label>
      <pre>{JSON.stringify(store().expandedValue)}</pre>
      <TreeView.Tree>
        <TreeView.Node<TreeNode>
          indentGuide={() => <TreeView.BranchIndentGuide />}
          render={
            /** Render a folder control or a file row. */
            ({ node, nodeState }) =>
              nodeState().isBranch ? (
                <TreeView.BranchControl>
                  <FolderIcon />
                  <TreeView.BranchText>{node.name}</TreeView.BranchText>
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item>
                  <FileIcon />
                  <TreeView.ItemText>{node.name}</TreeView.ItemText>
                </TreeView.Item>
              )
          }
        />
      </TreeView.Tree>
    </TreeView.RootProvider>
  );
}
