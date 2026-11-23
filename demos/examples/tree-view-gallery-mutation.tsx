import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { FileIcon, FolderIcon, PlusIcon, TrashIcon } from '@lucide/solid';
import { HStack, IconButton, TreeView, createTreeCollection, useTreeViewContext } from '../../src';
import './tree-view-gallery-mutation.css';

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

const initialCollection = createTreeCollection<TreeNode>({
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

interface NodeActionsProps {
  node: TreeNode;
  indexPath: number[];
  onRemove: (path: number[]) => void;
  onAdd: (path: number[], node: TreeNode) => void;
}

/** Provide per-node add and remove actions without selecting the row. */
function NodeActions(props: NodeActionsProps): JSX.Element {
  const tree = useTreeViewContext();

  /** Remove the current node while retaining tree focus behavior. */
  function remove(event: MouseEvent): void {
    event.stopPropagation();
    props.onRemove(props.indexPath);
  }

  /** Add a child to a folder and reveal it immediately. */
  function add(event: MouseEvent): void {
    event.stopPropagation();
    props.onAdd(props.indexPath, props.node);
    tree().expand([props.node.id]);
  }

  return (
    <HStack
      gap="0.5"
      class="tree-view-node-actions"
      style={{ position: 'absolute', right: '0', top: '0' }}
    >
      <IconButton size="xs" variant="ghost" aria-label="Remove node" onClick={remove}>
        <TrashIcon />
      </IconButton>
      {props.node.children && (
        <IconButton size="xs" variant="ghost" aria-label="Add node" onClick={add}>
          <PlusIcon />
        </IconButton>
      )}
    </HStack>
  );
}

/** Add and remove files from the collection in Solid state. */
export function TreeViewMutation(): JSX.Element {
  const [collection, setCollection] = createSignal(initialCollection);

  /** Remove the node at the current tree index path. */
  function removeNode(path: number[]): void {
    setCollection(
      /** Create an updated collection without the chosen node. */
      (current) => current.remove([path]),
    );
  }

  /** Insert a new file at the start of the chosen folder. */
  function addNode(path: number[], node: TreeNode): void {
    setCollection(
      /** Replace the selected folder with its new child list. */
      (current) => {
        const children = current.getNodeChildren(node);
        const added = { id: `untitled-${Date.now()}`, name: `untitled-${children.length}.tsx` };
        return current.replace(path, { ...node, children: [added, ...children] });
      },
    );
  }

  return (
    <TreeView.Root collection={collection()} style={{ 'max-width': 'var(--lui-sizes-sm)' }}>
      <TreeView.Label>Project files</TreeView.Label>
      <TreeView.Tree>
        <TreeView.Node<TreeNode>
          indentGuide={() => <TreeView.BranchIndentGuide />}
          render={
            /** Render a folder or file with its hover-only actions. */
            ({ node, indexPath, nodeState }) =>
              nodeState().isBranch ? (
                <TreeView.BranchControl>
                  <FolderIcon />
                  <TreeView.BranchText>{node.name}</TreeView.BranchText>
                  <NodeActions
                    node={node}
                    indexPath={indexPath}
                    onRemove={removeNode}
                    onAdd={addNode}
                  />
                </TreeView.BranchControl>
              ) : (
                <TreeView.Item>
                  <FileIcon />
                  <TreeView.ItemText>{node.name}</TreeView.ItemText>
                  <NodeActions
                    node={node}
                    indexPath={indexPath}
                    onRemove={removeNode}
                    onAdd={addNode}
                  />
                </TreeView.Item>
              )
          }
        />
      </TreeView.Tree>
    </TreeView.Root>
  );
}
