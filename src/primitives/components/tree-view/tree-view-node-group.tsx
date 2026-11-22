import { mergeProps } from '../../utils/merge-part-props';
import type { NodeState } from '@zag-js/tree-view';
import { createMemo, createUniqueId } from 'solid-js';
import type { Assign } from '../../types';
import { useRenderStrategyContext } from '../../utils/render-strategy';
import { Collapsible } from '../collapsible/index';
import type { HTMLProps, PolymorphicProps } from '../factory';
import { useTreeViewContext } from './use-tree-view-context';
import { useTreeViewNodeContext } from './use-tree-view-node-context';
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context';

export type TreeViewNodeGroupBaseProps = PolymorphicProps<'div', NodeState>;
export type TreeViewNodeGroupProps = Assign<HTMLProps<'div'>, TreeViewNodeGroupBaseProps>;

/** Render the TreeView node group. */
export const TreeViewNodeGroup = (props: TreeViewNodeGroupProps) => {
  const treeView = useTreeViewContext();

  const nodeProps = useTreeViewNodePropsContext();
  const nodeState = useTreeViewNodeContext();

  const renderStrategyProps = useRenderStrategyContext();
  // Zag 2 leaves unreferenced parts without ids, so give the collapsible its
  // own; an explicit `undefined` would replace the machine's generated id.
  const fallbackId = createUniqueId();
  const nodeGroupContentProps = createMemo(() => treeView().getNodeGroupContentProps(nodeProps));
  const mergedProps = mergeProps(() => treeView().getNodeGroupProps(nodeProps), props);

  return (
    <Collapsible.Root
      open={nodeState().expanded}
      {...renderStrategyProps}
      ids={{ content: nodeGroupContentProps().id || undefined }}
      {...mergedProps}
      id={mergedProps.id || fallbackId}
      state={treeView().getNodeState(nodeProps)}
    />
  );
};
