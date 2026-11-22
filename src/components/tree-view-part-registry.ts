import { TreeView as PrimitiveTreeView } from '../primitives/components/tree-view';
import { TreeViewExpandedIndicator, TreeViewRow, TreeViewSelectedIndicator } from './tree-view-row';

/** Pair each styled public part with its primitive machine part and native tag. */
export const treeViewPartTags = {
  branch: 'div',
  branchContent: 'div',
  branchControl: 'div',
  branchIndentGuide: 'div',
  branchIndicator: 'div',
  branchText: 'span',
  branchTrigger: 'div',
  item: 'div',
  itemIndicator: 'div',
  itemText: 'span',
  label: 'h3',
  tree: 'div',
  nodeCheckbox: 'span',
} as const;

export type TreeViewPartSlot = keyof typeof treeViewPartTags;

/**
 * Map each public Lever part onto the primitive's tree grid parts.
 *
 * Lever keeps its branch and item part names; the primitive calls them node
 * groups, rows, and typed indicators.
 */
export const treeViewPartComponents = {
  branch: PrimitiveTreeView.NodeGroup,
  branchContent: PrimitiveTreeView.NodeGroupContent,
  branchControl: TreeViewRow,
  branchIndentGuide: PrimitiveTreeView.IndentGuide,
  branchIndicator: TreeViewExpandedIndicator,
  branchText: PrimitiveTreeView.NodeText,
  branchTrigger: PrimitiveTreeView.NodeExpandTrigger,
  item: TreeViewRow,
  itemIndicator: TreeViewSelectedIndicator,
  itemText: PrimitiveTreeView.NodeText,
  label: PrimitiveTreeView.Label,
  tree: PrimitiveTreeView.Tree,
  nodeCheckbox: PrimitiveTreeView.NodeCheckbox,
} as const;
