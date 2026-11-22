import type { NodeProps } from '@zag-js/tree-view';
import { createMemo } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { createSplitProps } from '../../utils/create-split-props';
import { useTreeViewContext } from './use-tree-view-context';
import { TreeViewNodeStateProvider } from './use-tree-view-node-context';
import { TreeViewNodePropsProvider } from './use-tree-view-node-props-context';

export interface TreeViewNodeProviderBaseProps<T> extends NodeProps {
  node: T;
}
export interface TreeViewNodeProviderProps<T> extends TreeViewNodeProviderBaseProps<T> {
  children?: JSX.Element;
}

/** Provide the TreeView node provider to its children. */
export function TreeViewNodeProvider<T>(props: TreeViewNodeProviderProps<T>) {
  const [nodeProps, localProps] = createSplitProps<NodeProps>()(props, ['indexPath', 'node']);
  const treeView = useTreeViewContext();
  const nodeState = createMemo(() => treeView().getNodeState(nodeProps));
  return (
    <TreeViewNodeStateProvider value={nodeState}>
      <TreeViewNodePropsProvider value={nodeProps}>{localProps.children}</TreeViewNodePropsProvider>
    </TreeViewNodeStateProvider>
  );
}
