import type {
  PrimitiveNativeElementProps,
  PrimitiveNativeTag,
} from './primitive-native-element-props';
import type { treeViewPartTags, TreeViewPartSlot } from './tree-view-part-registry';

type TreeViewPartAppearance = { unstyled?: boolean; className?: string };

export type TreeViewPartProps<
  Slot extends TreeViewPartSlot,
  As extends PrimitiveNativeTag = (typeof treeViewPartTags)[Slot],
> = PrimitiveNativeElementProps<(typeof treeViewPartTags)[Slot], TreeViewPartAppearance, As>;

export type TreeViewBranchProps<As extends PrimitiveNativeTag = 'div'> = TreeViewPartProps<
  'branch',
  As
>;
export type TreeViewBranchContentProps<As extends PrimitiveNativeTag = 'div'> = TreeViewPartProps<
  'branchContent',
  As
>;
export type TreeViewBranchControlProps<As extends PrimitiveNativeTag = 'div'> = TreeViewPartProps<
  'branchControl',
  As
>;
export type TreeViewBranchIndentGuideProps<As extends PrimitiveNativeTag = 'div'> =
  TreeViewPartProps<'branchIndentGuide', As>;
export type TreeViewBranchIndicatorProps<As extends PrimitiveNativeTag = 'div'> = TreeViewPartProps<
  'branchIndicator',
  As
>;
export type TreeViewBranchTextProps<As extends PrimitiveNativeTag = 'span'> = TreeViewPartProps<
  'branchText',
  As
>;
export type TreeViewBranchTriggerProps<As extends PrimitiveNativeTag = 'div'> = TreeViewPartProps<
  'branchTrigger',
  As
>;
export type TreeViewItemProps<As extends PrimitiveNativeTag = 'div'> = TreeViewPartProps<
  'item',
  As
>;
export type TreeViewItemIndicatorProps<As extends PrimitiveNativeTag = 'div'> = TreeViewPartProps<
  'itemIndicator',
  As
>;
export type TreeViewItemTextProps<As extends PrimitiveNativeTag = 'span'> = TreeViewPartProps<
  'itemText',
  As
>;
export type TreeViewLabelProps<As extends PrimitiveNativeTag = 'h3'> = TreeViewPartProps<
  'label',
  As
>;
export type TreeViewTreeProps<As extends PrimitiveNativeTag = 'div'> = TreeViewPartProps<
  'tree',
  As
>;
export type TreeViewNodeCheckboxProps<As extends PrimitiveNativeTag = 'span'> = TreeViewPartProps<
  'nodeCheckbox',
  As
>;
