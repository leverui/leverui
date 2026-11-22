import {
  TreeView,
  createTreeCollection,
  useTreeView,
  useTreeViewContext,
} from '@leverui/components';
import { type JSX } from '@solidjs/web';

interface FileNode {
  id: string;
  name: string;
  children?: FileNode[];
}

const collection = createTreeCollection<FileNode>({
  nodeToValue:
    /** Keep installed machine values stable. */
    (node) => node.id,
  nodeToString:
    /** Give each installed node an accessible name. */
    (node) => node.name,
  rootNode: {
    id: 'root',
    name: 'Files',
    children: [
      {
        id: 'folder',
        name: 'Folder',
        children: [{ id: 'file', name: 'File.txt' }],
      },
    ],
  },
});

/** Read the installed machine context under the provider root. */
function PackedTreeProbe(): JSX.Element {
  const tree = useTreeViewContext();
  return <output data-testid="packed-tree-probe">{tree().selectedValue.join(',')}</output>;
}

/** Render one installed leaf through the primitive's node context. */
function renderLeaf({ node }: TreeView.NodeRenderProps<FileNode>): JSX.Element {
  return (
    <TreeView.Item data-testid="packed-tree-file">
      <TreeView.ItemText>{node.name}</TreeView.ItemText>
    </TreeView.Item>
  );
}

/** Render one installed branch through the primitive's expansion state. */
function renderBranch({ node }: TreeView.NodeRenderProps<FileNode>): JSX.Element {
  return (
    <TreeView.BranchControl data-testid="packed-tree-folder">
      <TreeView.BranchIndicator>▸</TreeView.BranchIndicator>
      <TreeView.BranchText>{node.name}</TreeView.BranchText>
    </TreeView.BranchControl>
  );
}

/** Exercise an externally owned tree through the packed public namespace. */
export function PackedTreeViewFamily(): JSX.Element {
  const machine = useTreeView({ collection, defaultExpandedValue: ['folder'] });
  return (
    <TreeView.RootProvider value={machine} size="sm" variant="solid" data-testid="packed-tree-root">
      <TreeView.Label>Installed files</TreeView.Label>
      <TreeView.Tree data-testid="packed-tree-list">
        <TreeView.Node<FileNode> render={renderLeaf} renderBranch={renderBranch} />
      </TreeView.Tree>
      <PackedTreeProbe />
    </TreeView.RootProvider>
  );
}
