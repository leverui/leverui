import type { Assign } from '../../types';
import type { NodeIndicatorType } from '@zag-js/tree-view';
import { mergeProps } from '../../utils/merge-part-props';
import { createSplitProps } from '../../utils/create-split-props';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import { useTreeViewContext } from './use-tree-view-context';
import { useTreeViewNodePropsContext } from './use-tree-view-node-props-context';

export interface TreeViewNodeIndicatorBaseProps extends PolymorphicProps<'div'> {
  /**
   * The type of indicator
   * - "expanded": always visible, reflects open/closed state
   * - "selected": shown when the node is selected
   * - "checked": shown when the node is checked
   * - "indeterminate": shown when the node is indeterminate (partially checked)
   */
  type: NodeIndicatorType;
}
export type TreeViewNodeIndicatorProps = Assign<HTMLProps<'div'>, TreeViewNodeIndicatorBaseProps>;

/** Render the TreeView node indicator. */
export const TreeViewNodeIndicator = (props: TreeViewNodeIndicatorProps) => {
  const [typeProps, localProps] = createSplitProps<{ type: NodeIndicatorType }>()(props, ['type']);
  const treeView = useTreeViewContext();
  const nodeProps = useTreeViewNodePropsContext();
  const mergedProps = mergeProps(
    () => treeView().getNodeIndicatorProps({ ...nodeProps, type: typeProps.type }),
    localProps,
  );

  return <primitive.div {...mergedProps} />;
};
