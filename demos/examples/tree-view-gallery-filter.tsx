import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { FileIcon, FolderIcon } from '@lucide/solid';
import { Highlight, Input, Stack, TreeView, createTreeCollection, useFilter } from '../../src';

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

/** Filter the file tree and expand surviving branches. */
export function TreeViewFilter(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const [items, setItems] = createSignal(collection);
  const [expanded, setExpanded] = createSignal<string[]>([]);
  const [query, setQuery] = createSignal('');

  /** Apply the case-insensitive label filter. */
  function search(value: string): void {
    setQuery(value);
    const next = collection.filter(
      /** Keep a node when its label contains the search term. */
      (node) => matcher().contains(node.name, value),
    );
    setItems(next);
    setExpanded(next.getBranchValues());
  }

  /** Keep the filter synchronized with the native input. */
  function handleInput(event: InputEvent & { currentTarget: HTMLInputElement }): void {
    search(event.currentTarget.value);
  }

  return (
    <Stack gap="3">
      <Input size="sm" placeholder="Search for files: 'react'" onInput={handleInput} />
      <TreeView.Root
        collection={items()}
        expandedValue={expanded()}
        onExpandedChange={
          /** Synchronize user expansion with the filtered collection. */
          (details) => setExpanded(details.expandedValue)
        }
      >
        <TreeView.Label class="leverui-visually-hidden">Tree</TreeView.Label>
        <TreeView.Tree>
          <TreeView.Node<TreeNode>
            indentGuide={() => <TreeView.BranchIndentGuide />}
            render={
              /** Highlight matching text in a filtered folder or file. */
              ({ node, nodeState }) => {
                const label = (
                  <Highlight
                    query={[query()]}
                    markStyle={{ 'background-color': 'var(--leverui-colors-gray-emphasized)' }}
                  >
                    {node.name}
                  </Highlight>
                );
                return nodeState().isBranch ? (
                  <TreeView.BranchControl>
                    <FolderIcon />
                    <TreeView.BranchText>{label}</TreeView.BranchText>
                  </TreeView.BranchControl>
                ) : (
                  <TreeView.Item>
                    <FileIcon />
                    <TreeView.ItemText>{label}</TreeView.ItemText>
                  </TreeView.Item>
                );
              }
            }
          />
        </TreeView.Tree>
      </TreeView.Root>
    </Stack>
  );
}
