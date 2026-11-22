import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type {
  TreeViewBranchControl as BranchControlExport,
  TreeViewItem as ItemExport,
  TreeViewNode as NodeExport,
  TreeViewNodeRenderProps,
  TreeViewRoot as RootExport,
  TreeViewTree as TreeExport,
  createTreeCollection as CollectionExport,
} from '../dist/index.js';

interface FileNode {
  id: string;
  name: string;
  children?: FileNode[];
}

export interface TreeViewHydrationComponents {
  TreeViewBranchControl: typeof BranchControlExport;
  TreeViewItem: typeof ItemExport;
  TreeViewNode: typeof NodeExport;
  TreeViewRoot: typeof RootExport;
  TreeViewTree: typeof TreeExport;
  createTreeCollection: typeof CollectionExport;
}

/** Render a leaf through the published recursive helper. */
function renderLeaf(
  components: TreeViewHydrationComponents,
  { node }: TreeViewNodeRenderProps<FileNode>,
): JSX.Element {
  return createComponent(components.TreeViewItem, {
    'data-testid': 'hydrated-tree-leaf',
    children: node.name,
  });
}

/** Render a branch through the published recursive helper. */
function renderBranch(
  components: TreeViewHydrationComponents,
  { node }: TreeViewNodeRenderProps<FileNode>,
): JSX.Element {
  return createComponent(components.TreeViewBranchControl, {
    'data-testid': 'hydrated-tree-branch',
    children: node.name,
  });
}

/** Build matching published Tree View nodes for SSR and hydration. */
export function renderTreeViewHydrationTree(components: TreeViewHydrationComponents): JSX.Element {
  const leaf: FileNode = { id: 'src/app', name: 'App.tsx' };
  const branch: FileNode = { id: 'src', name: 'Source', children: [leaf] };
  const collection = components.createTreeCollection<FileNode>({
    nodeToValue:
      /** Keep server and client machine values identical. */
      (node) => node.id,
    nodeToString:
      /** Keep accessible names identical across hydration. */
      (node) => node.name,
    rootNode: { id: 'root', name: 'Files', children: [branch] },
  });

  return createComponent(components.TreeViewRoot, {
    collection,
    defaultExpandedValue: ['src'],
    /** Keep the tree under the primitive's machine context. */
    get children(): JSX.Element {
      return createComponent(components.TreeViewTree, {
        /** Build branch and leaf providers inside the recursive helper. */
        get children(): JSX.Element {
          return createComponent(components.TreeViewNode<FileNode>, {
            render:
              /** Preserve the published leaf renderer during hydration. */
              (props) => renderLeaf(components, props),
            renderBranch:
              /** Preserve the published branch renderer during hydration. */
              (props) => renderBranch(components, props),
          });
        },
      });
    },
  });
}
