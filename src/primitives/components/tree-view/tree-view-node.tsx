import { mergeProps } from '../../utils/merge-part-props';
import type { NodeState } from '@zag-js/tree-view';
import type { Assign } from '../../types';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTreeViewContext } from './use-tree-view-context';
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context';

export type TreeViewNodeState = NodeState;

export type TreeViewNodeBaseProps = PolymorphicProps<'div', TreeViewNodeState>;
export type TreeViewNodeProps = Assign<HTMLProps<'div'>, TreeViewNodeBaseProps>;

/** Render the TreeView node. */
export const TreeViewNode = (props: TreeViewNodeProps) => {
  const treeView = useTreeViewContext();
  const nodeProps = useTreeViewNodePropsContext();
  const mergedProps = mergeProps(() => treeView().getNodeProps(nodeProps), props);

  return <primitive.div {...mergedProps} state={treeView().getNodeState(nodeProps)} />;
};
