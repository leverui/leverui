import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTreeViewContext } from './use-tree-view-context';

export type TreeViewTreeBaseProps = PolymorphicProps<'div'>;
export type TreeViewTreeProps = Assign<HTMLProps<'div'>, TreeViewTreeBaseProps>;

/** Render the TreeView tree. */
export const TreeViewTree = (props: TreeViewTreeProps) => {
  const treeView = useTreeViewContext();
  const mergedProps = mergeProps(() => treeView().getTreeProps(), props);

  return <primitive.div {...mergedProps} />;
};
