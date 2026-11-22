import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTreeViewContext } from './use-tree-view-context';
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context';

export type TreeViewCellBaseProps = PolymorphicProps<'div'>;
export type TreeViewCellProps = Assign<HTMLProps<'div'>, TreeViewCellBaseProps>;

/** Render the TreeView cell. */
export const TreeViewCell = (props: TreeViewCellProps) => {
  const treeView = useTreeViewContext();
  const nodeProps = useTreeViewNodePropsContext();
  const mergedProps = mergeProps(() => treeView().getNodeCellProps(nodeProps), props);

  return <primitive.div {...mergedProps} />;
};
