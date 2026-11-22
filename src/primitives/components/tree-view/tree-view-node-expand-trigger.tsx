import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTreeViewContext } from './use-tree-view-context';
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context';

export type TreeViewNodeExpandTriggerBaseProps = PolymorphicProps<'div'>;
export type TreeViewNodeExpandTriggerProps = Assign<
  HTMLProps<'div'>,
  TreeViewNodeExpandTriggerBaseProps
>;

/** Render the TreeView node expand trigger. */
export const TreeViewNodeExpandTrigger = (props: TreeViewNodeExpandTriggerProps) => {
  const treeView = useTreeViewContext();
  const nodeProps = useTreeViewNodePropsContext();
  const mergedProps = mergeProps(() => treeView().getNodeExpandTriggerProps(nodeProps), props);

  return <primitive.div {...mergedProps} />;
};
