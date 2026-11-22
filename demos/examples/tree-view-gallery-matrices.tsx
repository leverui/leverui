import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { FileIcon, FolderIcon } from '@lucide/solid';
import { Stack, TreeView, Wrap, createTreeCollection } from '../../src';

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

const palettes = [
  'gray',
  'red',
  'green',
  'blue',
  'teal',
  'pink',
  'purple',
  'cyan',
  'orange',
  'yellow',
] as const;

/** Show all ten palettes with a selected folder. */
export function TreeViewColors(): JSX.Element {
  return (
    <Wrap gap="8">
      <For each={palettes}>
        {(palette) => (
          <TreeView.Root
            collection={collection}
            style={{ 'max-width': 'var(--leverui-sizes-xs)' }}
            size="sm"
            colorPalette={palette}
            defaultSelectedValue={['node_modules']}
          >
            <TreeView.Label>Tree (colorPalette={palette})</TreeView.Label>
            <TreeView.Tree>
              <TreeView.Node<TreeNode>
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
        )}
      </For>
    </Wrap>
  );
}

/** Show the three row-density options. */
export function TreeViewSizes(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={['xs', 'sm', 'md'] as const}>
        {(size) => (
          <TreeView.Root
            collection={collection}
            style={{ 'max-width': 'var(--leverui-sizes-sm)' }}
            size={size}
          >
            <TreeView.Label>Tree (size={size})</TreeView.Label>
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
        )}
      </For>
    </Stack>
  );
}

/** Compare the two selected-state CSS variants in teal. */
export function TreeViewVariants(): JSX.Element {
  return (
    <Stack gap="8">
      <For each={['subtle', 'solid'] as const}>
        {(variant) => (
          <TreeView.Root
            collection={collection}
            style={{ 'max-width': 'var(--leverui-sizes-sm)' }}
            size="sm"
            variant={variant}
            colorPalette="teal"
            defaultSelectedValue={['node_modules']}
          >
            <TreeView.Label>Tree (variant={variant})</TreeView.Label>
            <TreeView.Tree>
              <TreeView.Node<TreeNode>
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
        )}
      </For>
    </Stack>
  );
}
