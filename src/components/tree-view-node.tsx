import { For, untrack, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { TreeCollection, TreeNode, TreeViewNodeState } from './tree-view-machine';
import { TreeViewNodeContext, TreeViewNodeProvider, useTreeViewContext } from './tree-view-machine';
import type { TreeViewBranchContentProps, TreeViewBranchProps } from './tree-view-part-props';
import { TreeViewBranch, TreeViewBranchContent } from './tree-view-parts';

export interface TreeViewNodeRenderProps<T extends TreeNode = TreeNode> {
  node: T;
  indexPath: number[];
  nodeState: Accessor<TreeViewNodeState>;
}

export interface TreeViewNodeProps<T extends TreeNode = TreeNode> {
  /**
   * Renders each leaf, and each branch when `renderBranch` is absent. It runs once per row, so
   * read `nodeState()` inside the returned JSX; a read before the JSX is not tracked.
   */
  render: (props: TreeViewNodeRenderProps<T>) => JSX.Element;
  /** Renders branch rows. Like `render`, it runs once; read `nodeState()` inside its JSX. */
  renderBranch?: (props: TreeViewNodeRenderProps<T>) => JSX.Element;
  indentGuide?: () => JSX.Element;
  branchProps?: TreeViewBranchProps;
  branchContentProps?: TreeViewBranchContentProps;
}

interface EntryProps<T extends TreeNode> {
  node: T;
  indexPath: number[];
  collection: Accessor<TreeCollection<T>>;
  options: TreeViewNodeProps<T>;
}

/** Render one node under the primitive's reactive node and collection contexts. */
function TreeViewNodeEntry<T extends TreeNode>(props: EntryProps<T>): JSX.Element {
  /** Extend the current collection path for one descendant. */
  function renderChild(child: T, index: Accessor<number>): JSX.Element {
    return (
      <TreeViewNodeEntry
        node={child}
        indexPath={[...props.indexPath, index()]}
        collection={props.collection}
        options={props.options}
      />
    );
  }

  /** Choose the branch or leaf renderer from the primitive's reactive node state. */
  function renderNode(nodeState: Accessor<TreeViewNodeState>): JSX.Element {
    const renderProps = { node: props.node, indexPath: props.indexPath, nodeState };
    /** Build a row once; state reads belong in the row's own JSX, not this call. */
    function renderRow(renderer: TreeViewNodeProps<T>['render']): JSX.Element {
      return untrack(() => renderer(renderProps));
    }
    if (!nodeState().isBranch) return renderRow(props.options.render);

    return (
      <TreeViewBranch {...(props.options.branchProps ?? {})}>
        {renderRow(props.options.renderBranch ?? props.options.render)}
        <TreeViewBranchContent {...(props.options.branchContentProps ?? {})}>
          {props.options.indentGuide?.()}
          <For each={props.collection().getNodeChildren(props.node)}>{renderChild}</For>
        </TreeViewBranchContent>
      </TreeViewBranch>
    );
  }

  /** Recreate node providers when a reused node moves to a new index path. */
  function renderEntry(): JSX.Element {
    return (
      <TreeViewNodeProvider node={props.node} indexPath={props.indexPath}>
        <TreeViewNodeContext>
          {
            /** Feed primitive's reactive node state into the documented renderer. */
            (nodeState) => renderNode(nodeState)
          }
        </TreeViewNodeContext>
      </TreeViewNodeProvider>
    );
  }

  return <For each={[props.indexPath.join('.')]}>{renderEntry}</For>;
}

/** Render every root node and its descendants from the primitive's collection. */
export function TreeViewNode<T extends TreeNode = TreeNode>(
  props: TreeViewNodeProps<T>,
): JSX.Element {
  const tree = useTreeViewContext();

  /** Restore the collection's node type erased by the primitive's shared context. */
  function collection(): TreeCollection<T> {
    return tree().collection as TreeCollection<T>;
  }

  /** Start one root node at its collection index. */
  function renderRoot(node: T, index: Accessor<number>): JSX.Element {
    return (
      <TreeViewNodeEntry
        node={node}
        indexPath={[index()]}
        collection={collection}
        options={props}
      />
    );
  }

  return <For each={collection().getNodeChildren(collection().rootNode)}>{renderRoot}</For>;
}
