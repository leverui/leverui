import { type JSX } from '@solidjs/web';
import { type UseTreeViewNodeContext, useTreeViewNodeContext } from './use-tree-view-node-context';

export interface TreeViewNodeContextProps {
  children: (context: UseTreeViewNodeContext) => JSX.Element;
}

/** Render the TreeView node context through a function child. */
export const TreeViewNodeContext = (props: TreeViewNodeContextProps) =>
  props.children(useTreeViewNodeContext());
