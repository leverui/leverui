import { type JSX } from '@solidjs/web';
import { FileIcon, FolderIcon } from '@lucide/solid';
import { Menu, Portal, TreeView, createTreeCollection } from '../../src';

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

/** Give one file or folder its own right-click action menu. */
function ContextNode(props: { node: TreeNode; branch?: boolean }): JSX.Element {
  return (
    <Menu.Root>
      <Menu.ContextTrigger
        asChild={
          /** Preserve the Tree View item's native role and context gesture. */
          (getProps) =>
            props.branch ? (
              <TreeView.BranchControl {...getProps()}>
                <FolderIcon />
                <TreeView.BranchText>{props.node.name}</TreeView.BranchText>
              </TreeView.BranchControl>
            ) : (
              <TreeView.Item {...getProps()}>
                <FileIcon />
                <TreeView.ItemText>{props.node.name}</TreeView.ItemText>
              </TreeView.Item>
            )
        }
      />
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value="rename">Rename</Menu.Item>
            <Menu.Item value="delete">Delete</Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}

/** Open Rename and Delete actions on a tree item's context gesture. */
export function TreeViewContextMenu(): JSX.Element {
  return (
    <TreeView.Root collection={collection} style={{ 'max-width': 'var(--lui-sizes-sm)' }}>
      <TreeView.Label>Project files</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Node<TreeNode>
          render={
            /** Render a file with its contextual actions. */
            ({ node }) => <ContextNode node={node} />
          }
          renderBranch={
            /** Render a folder with its contextual actions. */
            ({ node }) => <ContextNode node={node} branch />
          }
          indentGuide={
            /** Draw the nesting guide for menu-enabled folders. */
            () => <TreeView.BranchIndentGuide />
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
}
