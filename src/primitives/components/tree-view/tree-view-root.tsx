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
import { type UseTreeViewProps, useTreeView } from './use-tree-view';
import { TreeViewProvider } from './use-tree-view-context';

export type TreeViewRootBaseProps<T extends TreeNode> = UseTreeViewProps<T> &
  RenderStrategyProps &
  PolymorphicProps<'div'>;
export type TreeViewRootProps<T extends TreeNode> = Assign<
  HTMLProps<'div'>,
  TreeViewRootBaseProps<T>
>;

/** Render the TreeView root. */
export const TreeViewRoot = <T extends TreeNode>(props: TreeViewRootProps<T>) => {
  const [renderStrategyProps, treeViewProps] = splitRenderStrategyProps(props);
  const [useTreeViewProps, localProps] = createSplitProps<UseTreeViewProps<T>>()(treeViewProps, [
    'canRename',
    'checkedValue',
    'collection',
    'defaultCheckedValue',
    'defaultExpandedValue',
    'defaultFocusedValue',
    'defaultSelectedValue',
    'expandedValue',
    'expandOnClick',
    'focusedValue',
    'id',
    'ids',
    'loadChildren',
    'onBeforeRename',
    'onCheckedChange',
    'onExpandedChange',
    'onFocusChange',
    'onLoadChildrenComplete',
    'onLoadChildrenError',
    'onRenameComplete',
    'onRenameStart',
    'onSelectionChange',
    'selectedValue',
    'selectionMode',
    'translations',
    'typeahead',
    'scrollToIndexFn',
  ]);
  const treeView = useTreeView(useTreeViewProps);
  const mergedProps = mergeProps(() => treeView().getRootProps(), localProps);

  return (
    <TreeViewProvider value={treeView}>
      <RenderStrategyProvider value={renderStrategyProps}>
        <primitive.div {...mergedProps} />
      </RenderStrategyProvider>
    </TreeViewProvider>
  );
};

export type TreeViewRootComponentProps<
  T extends TreeNode = TreeNode,
  P = Record<never, never>,
> = Assign<TreeViewRootProps<T>, P>;

export type TreeViewRootComponent<P = Record<never, never>> = <T extends TreeNode>(
  props: TreeViewRootComponentProps<T, P>,
) => JSX.Element;
