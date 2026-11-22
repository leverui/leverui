import type { Assign } from '../../types';
import { mergeProps } from '../../utils/merge-part-props';
import { createMemo } from 'solid-js';
import { createSplitProps } from '../../utils/create-split-props';
import { Collapsible } from '../collapsible/index';
import type { HTMLProps, PolymorphicProps } from '../factory';
import { useTreeViewContext } from './use-tree-view-context';
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context';

export type TreeViewNodeGroupContentBaseProps = PolymorphicProps<'div'>;
export type TreeViewNodeGroupContentProps = Assign<
  HTMLProps<'div'>,
  TreeViewNodeGroupContentBaseProps
>;

interface VisibilityProps {
  hidden?: boolean;
  'data-state'?: string;
}

const splitVisibilityProps = createSplitProps<VisibilityProps>();

/** Render the TreeView node group content. */
export const TreeViewNodeGroupContent = (props: TreeViewNodeGroupContentProps) => {
  const treeView = useTreeViewContext();
  const nodeProps = useTreeViewNodePropsContext();

  const nodeGroupContentProps = createMemo(() => {
    const contentProps = treeView().getNodeGroupContentProps(nodeProps);
    const [, ownProps] = splitVisibilityProps(contentProps as VisibilityProps, [
      'hidden',
      'data-state',
    ]);
    return ownProps;
  });
  const mergedProps = mergeProps(() => nodeGroupContentProps(), props);

  return <Collapsible.Content {...mergedProps} />;
};
