import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTreeViewContext } from './use-tree-view-context';
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context';

export type TreeViewIndentGuideBaseProps = PolymorphicProps<'div'>;
export type TreeViewIndentGuideProps = Assign<HTMLProps<'div'>, TreeViewIndentGuideBaseProps>;

/** Render the TreeView indent guide. */
export const TreeViewIndentGuide = (props: TreeViewIndentGuideProps) => {
  const treeView = useTreeViewContext();
  const nodeProps = useTreeViewNodePropsContext();
  const mergedProps = mergeProps(() => treeView().getIndentGuideProps(nodeProps), props);

  return <primitive.div {...mergedProps} />;
};
