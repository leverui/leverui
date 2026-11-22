import { type JSX } from '@solidjs/web';
import type { TreeNode } from '../collection/index';
import { type UseTreeViewContext, useTreeViewContext } from './use-tree-view-context';

export interface TreeViewContextProps<T extends TreeNode> {
  children: (context: UseTreeViewContext<T>) => JSX.Element;
}

/** Render the TreeView context. */
export const TreeViewContext = <T extends TreeNode>(props: TreeViewContextProps<T>) =>
  props.children(useTreeViewContext());
