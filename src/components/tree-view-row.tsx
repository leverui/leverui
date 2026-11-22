import { splitProps } from '../primitives/utils/split-props';
import { TreeView as PrimitiveTreeView } from '../primitives/components/tree-view';
import { createComponent } from 'solid-js';
import { mergeProps } from '../primitives/utils/merge-props';
import { type ComponentProps, type JSX } from '@solidjs/web';

type NodeProps = ComponentProps<typeof PrimitiveTreeView.Node>;
type IndicatorProps = Omit<ComponentProps<typeof PrimitiveTreeView.NodeIndicator>, 'type'>;

/**
 * Render one tree row: the primitive's `Node` row around a single `Cell`.
 *
 * The primitive renders the tree as a grid, so each branch control or leaf is a row
 * holding a grid cell. Lever's `BranchControl` and `Item` parts keep their
 * names and classes on the row; the cell carries the caller's content.
 */
export function TreeViewRow(props: NodeProps): JSX.Element {
  const [content, row] = splitProps(props, ['children']);
  return createComponent(
    PrimitiveTreeView.Node,
    mergeProps(row, {
      /** Wrap the row's content in its grid cell. */
      get children() {
        return createComponent(PrimitiveTreeView.Cell, {
          class: 'leverui-tree-view__cell',
          /** Read the caller's content inside the cell. */
          get children() {
            return content.children;
          },
        });
      },
    }),
  );
}

/** Show a branch's expanded state through the primitive's typed node indicator. */
export function TreeViewExpandedIndicator(props: IndicatorProps): JSX.Element {
  return createComponent(
    PrimitiveTreeView.NodeIndicator,
    mergeProps({ type: 'expanded' as const }, props),
  );
}

/** Show a leaf's selected state through the primitive's typed node indicator. */
export function TreeViewSelectedIndicator(props: IndicatorProps): JSX.Element {
  return createComponent(
    PrimitiveTreeView.NodeIndicator,
    mergeProps({ type: 'selected' as const }, props),
  );
}
