import { createContext } from '../../utils/create-context';
import type { TreeNode } from '../collection/index';
import type { UseTreeViewReturn } from './use-tree-view';

export type UseTreeViewContext<T extends TreeNode> = UseTreeViewReturn<T>;

export const [TreeViewProvider, useTreeViewContext] = createContext<UseTreeViewContext<TreeNode>>({
  hookName: 'useTreeViewContext',
  providerName: '<TreeViewProvider />',
});
