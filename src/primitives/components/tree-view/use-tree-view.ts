import { type PropTypes, normalizeProps, useMachine } from '@zag-js/solid';
import * as treeView from '@zag-js/tree-view';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { MaybeAccessor, Optional } from '../../types';
import { runIfFn } from '../../utils/run-if-fn';
import type { TreeCollection, TreeNode } from '../collection/index';

export interface UseTreeViewProps<T extends TreeNode> extends Optional<
  Omit<treeView.Props<T>, 'dir' | 'getRootNode' | 'collection'>,
  'id'
> {
  /**
   * The collection of tree nodes
   */
  collection: TreeCollection<T>;
}
export type UseTreeViewReturn<T extends TreeNode> = Accessor<treeView.Api<PropTypes, T>>;

/** Create the tree view state and return its API. */
export const useTreeView = <T extends TreeNode>(
  props: MaybeAccessor<UseTreeViewProps<T>>,
): UseTreeViewReturn<T> => {
  const id = createUniqueId();
  const locale = useLocaleContext();
  const environment = useEnvironmentContext();

  const machineProps = createMemo<treeView.Props>(() => ({
    id,
    dir: locale().dir,
    getRootNode: environment().getRootNode,
    ...runIfFn(props),
  }));

  const service = useMachine(treeView.machine, machineProps);
  return createMemo(() => treeView.connect(service, normalizeProps));
};
