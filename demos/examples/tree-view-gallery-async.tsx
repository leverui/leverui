import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { FileIcon, FolderIcon } from '@lucide/solid';
import { Spinner, TreeView, createTreeCollection } from '../../src';

interface AsyncNode {
  id: string;
  name: string;
  children?: AsyncNode[];
  childrenCount?: number;
}

const response: Record<string, AsyncNode[]> = {
  node_modules: [
    { id: 'solid-js', name: 'solid-js' },
    { id: 'vite', name: 'vite' },
    { id: '@types', name: '@types', childrenCount: 2 },
  ],
  'node_modules/@types': [
    { id: 'react', name: 'react' },
    { id: 'react-dom', name: 'react-dom' },
  ],
  src: [
    { id: 'app.tsx', name: 'app.tsx' },
    { id: 'index.ts', name: 'index.ts' },
  ],
};

const initialCollection = createTreeCollection<AsyncNode>({
  nodeToValue:
    /** Keep loaded child values stable under their parent. */
    (node) => node.id,
  nodeToString:
    /** Expose the visible file name to the tree machine. */
    (node) => node.name,
  rootNode: {
    id: 'ROOT',
    name: '',
    children: [
      { id: 'node_modules', name: 'node_modules', childrenCount: 3 },
      { id: 'src', name: 'src', childrenCount: 2 },
      { id: 'vite.config', name: 'vite.config.ts' },
      { id: 'package.json', name: 'package.json' },
      { id: 'renovate.json', name: 'renovate.json' },
      { id: 'readme.md', name: 'README.md' },
    ],
  },
});

/** Resolve the mock branch data after its visible loading delay. */
function loadChildren(details: TreeView.LoadChildrenDetails<AsyncNode>): Promise<AsyncNode[]> {
  const path = details.valuePath.join('/');
  return new Promise(
    /** Complete the mock request after the 1.2-second wait. */
    (resolve) => {
      setTimeout(
        /** Deliver only the child nodes for the expanded path. */
        () => resolve(response[path] ?? []),
        1200,
      );
    },
  );
}

/** Lazily load descendants through the public Tree View collection callback. */
export function TreeViewLazyLoad(): JSX.Element {
  const [collection, setCollection] = createSignal(initialCollection);
  return (
    <TreeView.Root
      collection={collection()}
      loadChildren={loadChildren}
      onLoadChildrenComplete={
        /** Replace the collection when the machine receives loaded children. */
        (details) => setCollection(details.collection)
      }
    >
      <TreeView.Label>Project files</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Node<AsyncNode>
          indentGuide={() => <TreeView.BranchIndentGuide />}
          render={
            /** Render a loaded file row, or a folder with a spinner while it loads. */
            ({ node, nodeState }) =>
              nodeState().isBranch ? (
                <TreeView.BranchControl>
                  {nodeState().loading ? <Spinner size="xs" /> : <FolderIcon />}
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
