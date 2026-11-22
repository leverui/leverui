import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTreeViewContext } from './use-tree-view-context';

export type TreeViewLabelBaseProps = PolymorphicProps<'h3'>;
export type TreeViewLabelProps = Assign<HTMLProps<'h3'>, TreeViewLabelBaseProps>;

/** Render the TreeView label. */
export const TreeViewLabel = (props: TreeViewLabelProps) => {
  const treeView = useTreeViewContext();
  const mergedProps = mergeProps(() => treeView().getLabelProps(), props);

  return <primitive.h3 {...mergedProps} />;
};
