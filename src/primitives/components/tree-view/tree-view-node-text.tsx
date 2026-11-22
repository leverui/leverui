import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTreeViewContext } from './use-tree-view-context';
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context';

export type TreeViewNodeTextBaseProps = PolymorphicProps<'span'>;
export type TreeViewNodeTextProps = Assign<HTMLProps<'span'>, TreeViewNodeTextBaseProps>;

/** Render the TreeView node text. */
export const TreeViewNodeText = (props: TreeViewNodeTextProps) => {
  const treeView = useTreeViewContext();
  const nodeProps = useTreeViewNodePropsContext();
  const mergedProps = mergeProps(() => treeView().getNodeTextProps(nodeProps), props);

  return <primitive.span {...mergedProps} />;
};
