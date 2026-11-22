import { type JSX } from '@solidjs/web';
import type { ComponentIntrinsicElement } from './component-element-props';
import { renderTreeViewPart } from './tree-view-part';
import type {
  TreeViewBranchContentProps,
  TreeViewBranchControlProps,
  TreeViewBranchIndentGuideProps,
  TreeViewBranchIndicatorProps,
  TreeViewBranchProps,
  TreeViewBranchTextProps,
  TreeViewBranchTriggerProps,
  TreeViewItemIndicatorProps,
  TreeViewItemProps,
  TreeViewItemTextProps,
  TreeViewLabelProps,
  TreeViewNodeCheckboxProps,
  TreeViewTreeProps,
} from './tree-view-part-props';

/** Render a branch and retain the primitive's collapsible node state. */
export function TreeViewBranch<As extends ComponentIntrinsicElement = 'div'>(
  props: TreeViewBranchProps<As>,
): JSX.Element {
  return renderTreeViewPart('branch', props);
}

/** Render the expandable content owned by a branch. */
export function TreeViewBranchContent<As extends ComponentIntrinsicElement = 'div'>(
  props: TreeViewBranchContentProps<As>,
): JSX.Element {
  return renderTreeViewPart('branchContent', props);
}

/** Render a branch's selectable control surface. */
export function TreeViewBranchControl<As extends ComponentIntrinsicElement = 'div'>(
  props: TreeViewBranchControlProps<As>,
): JSX.Element {
  return renderTreeViewPart('branchControl', props);
}

/** Show the indentation guide beneath a branch. */
export function TreeViewBranchIndentGuide<As extends ComponentIntrinsicElement = 'div'>(
  props: TreeViewBranchIndentGuideProps<As>,
): JSX.Element {
  return renderTreeViewPart('branchIndentGuide', props);
}

/** Show the expansion state beside a branch label. */
export function TreeViewBranchIndicator<As extends ComponentIntrinsicElement = 'div'>(
  props: TreeViewBranchIndicatorProps<As>,
): JSX.Element {
  return renderTreeViewPart('branchIndicator', props);
}

/** Render the visible name of a branch. */
export function TreeViewBranchText<As extends ComponentIntrinsicElement = 'span'>(
  props: TreeViewBranchTextProps<As>,
): JSX.Element {
  return renderTreeViewPart('branchText', props);
}

/** Render the primitive's explicit branch expansion trigger. */
export function TreeViewBranchTrigger<As extends ComponentIntrinsicElement = 'div'>(
  props: TreeViewBranchTriggerProps<As>,
): JSX.Element {
  return renderTreeViewPart('branchTrigger', props);
}

/** Render a selectable leaf with the primitive's keyboard semantics. */
export function TreeViewItem<As extends ComponentIntrinsicElement = 'div'>(
  props: TreeViewItemProps<As>,
): JSX.Element {
  return renderTreeViewPart('item', props);
}

/** Decorate a leaf with its current item state. */
export function TreeViewItemIndicator<As extends ComponentIntrinsicElement = 'div'>(
  props: TreeViewItemIndicatorProps<As>,
): JSX.Element {
  return renderTreeViewPart('itemIndicator', props);
}

/** Render the visible name of a leaf. */
export function TreeViewItemText<As extends ComponentIntrinsicElement = 'span'>(
  props: TreeViewItemTextProps<As>,
): JSX.Element {
  return renderTreeViewPart('itemText', props);
}

/** Label the tree without replacing the primitive's heading semantics. */
export function TreeViewLabel<As extends ComponentIntrinsicElement = 'h3'>(
  props: TreeViewLabelProps<As>,
): JSX.Element {
  return renderTreeViewPart('label', props);
}

/** Render the root tree group and its navigation semantics. */
export function TreeViewTree<As extends ComponentIntrinsicElement = 'div'>(
  props: TreeViewTreeProps<As>,
): JSX.Element {
  return renderTreeViewPart('tree', props);
}

/** Render the machine-controlled checkbox for a node. */
export function TreeViewNodeCheckbox<As extends ComponentIntrinsicElement = 'span'>(
  props: TreeViewNodeCheckboxProps<As>,
): JSX.Element {
  return renderTreeViewPart('nodeCheckbox', props);
}
