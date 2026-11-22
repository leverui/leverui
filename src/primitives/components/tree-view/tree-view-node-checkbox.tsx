import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTreeViewContext } from './use-tree-view-context';
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context';

export type TreeViewNodeCheckboxBaseProps = PolymorphicProps<'span'>;
export type TreeViewNodeCheckboxProps = Assign<HTMLProps<'span'>, TreeViewNodeCheckboxBaseProps>;

/** Render the TreeView node checkbox. */
export const TreeViewNodeCheckbox = (props: TreeViewNodeCheckboxProps) => {
  const treeView = useTreeViewContext();
  const nodeProps = useTreeViewNodePropsContext();
  const mergedProps = mergeProps(() => treeView().getNodeCheckboxProps(nodeProps), props);

  return <primitive.span {...mergedProps} />;
};
