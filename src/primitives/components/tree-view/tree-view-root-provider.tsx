import { mergeProps } from '../../utils/merge-part-props';
import { type JSX } from '@solidjs/web';
import type { Assign } from '../../types';
import { createSplitProps } from '../../utils/create-split-props';
import {
  type RenderStrategyProps,
  RenderStrategyProvider,
  splitRenderStrategyProps,
} from '../../utils/render-strategy';
import type { TreeNode } from '../collection/index';
import { type HTMLProps, type PolymorphicProps, primitive } from '../factory';
import type { UseTreeViewReturn } from './use-tree-view';
import { TreeViewProvider } from './use-tree-view-context';

interface RootProviderProps<T extends TreeNode> {
  value: UseTreeViewReturn<T>;
}
export type TreeViewRootProviderBaseProps<T extends TreeNode> = RootProviderProps<T> &
  RenderStrategyProps &
  PolymorphicProps<'div'>;
export type TreeViewRootProviderProps<T extends TreeNode> = Assign<
  HTMLProps<'div'>,
  TreeViewRootProviderBaseProps<T>
>;

/** Provide the TreeView root provider to its children. */
export const TreeViewRootProvider = <T extends TreeNode>(props: TreeViewRootProviderProps<T>) => {
  const [renderStrategyProps, treeViewProps] = splitRenderStrategyProps(props);
  const [{ value: treeView }, localProps] = createSplitProps<RootProviderProps<T>>()(
    treeViewProps,
    ['value'],
  );
  const mergedProps = mergeProps(() => treeView().getRootProps(), localProps);

  return (
    <TreeViewProvider value={treeView}>
      <RenderStrategyProvider value={renderStrategyProps}>
        <primitive.div {...mergedProps} />
      </RenderStrategyProvider>
    </TreeViewProvider>
  );
};

export type TreeViewRootProviderComponent<P = Record<never, never>> = <T extends TreeNode>(
  props: Assign<TreeViewRootProviderProps<T>, P>,
) => JSX.Element;
