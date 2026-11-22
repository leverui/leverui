import { mergeProps } from '../../utils/merge-part-props';
import type { Assign } from '../../types';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTreeViewContext } from './use-tree-view-context';
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context';

export type TreeViewNodeRenameInputBaseProps = PolymorphicProps<'input'>;
export type TreeViewNodeRenameInputProps = Assign<
  HTMLProps<'input'>,
  TreeViewNodeRenameInputBaseProps
>;

/** Render the TreeView node rename input. */
export const TreeViewNodeRenameInput = (props: TreeViewNodeRenameInputProps) => {
  const treeView = useTreeViewContext();
  const nodeProps = useTreeViewNodePropsContext();
  const mergedProps = mergeProps(() => treeView().getNodeRenameInputProps(nodeProps), props);

  return <primitive.input {...mergedProps} />;
};
