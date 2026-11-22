import type { NodeState } from '@zag-js/tree-view';
import { type Accessor } from 'solid-js';
import { createContext } from '../../utils/create-context';

export type UseTreeViewNodeContext = Accessor<NodeState>;

export const [TreeViewNodeStateProvider, useTreeViewNodeContext] =
  createContext<UseTreeViewNodeContext>({
    hookName: 'useTreeViewNodeContext',
    providerName: '<TreeViewNodeProvider />',
  });
