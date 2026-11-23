import type { Demo, DemoMeta } from './demo-types';
import { withComponentInset } from './examples/example-frame';
import {
  TreeViewCollapseAnimation,
  TreeViewRemoveIndentation,
} from './examples/tree-view-gallery-animation';
import { TreeViewLazyLoad } from './examples/tree-view-gallery-async';
import { TreeViewCheckboxTree } from './examples/tree-view-gallery-checkbox';
import { TreeViewContextMenu } from './examples/tree-view-gallery-context';
import { TreeViewCustomIcon } from './examples/tree-view-gallery-design';
import { TreeViewDisabledNode } from './examples/tree-view-gallery-disabled';
import {
  TreeViewExpandIcon,
  TreeViewExpandedStyling,
} from './examples/tree-view-gallery-expand-icon';
import {
  TreeViewExpandCollapseAll,
  TreeViewExplicitExpand,
} from './examples/tree-view-gallery-expansion';
import { TreeViewFilter } from './examples/tree-view-gallery-filter';
import { TreeViewLinks } from './examples/tree-view-gallery-links';
import {
  TreeViewColors,
  TreeViewSizes,
  TreeViewVariants,
} from './examples/tree-view-gallery-matrices';
import { TreeViewMutation } from './examples/tree-view-gallery-mutation';
import { TreeViewMultiSelect, TreeViewStore } from './examples/tree-view-gallery-selection';
import {
  TreeViewBasic,
  TreeViewControlledExpansion,
  TreeViewDefaultExpanded,
} from './examples/tree-view-gallery-states';
import { markdownGuide } from './guide-markdown';

export const meta = {
  component: TreeViewBasic,
  decorators: [withComponentInset],
} satisfies DemoMeta;

type Story = Demo;

/** Attach the guide description for one example. */
function guide(description: string): Story['parameters'] {
  return { guide: { description } };
}

export const Basic: Story = {
  name: 'Basic',
  render: TreeViewBasic,
};
export const Sizes: Story = {
  name: 'Sizes',
  render: TreeViewSizes,
  parameters: guide('Use the `size` prop to change the size of the tree view.'),
};
export const Variants: Story = {
  name: 'Variants',
  render: TreeViewVariants,
  parameters: guide('Use the `variant` prop to change the variant of the tree view.'),
};
export const Colors: Story = {
  name: 'Colors',
  render: TreeViewColors,
  parameters: guide('Use the `colorPalette` prop to change the color palette of the tree view.'),
};
export const DisabledNode: Story = {
  name: 'DisabledNode',
  render: TreeViewDisabledNode,
  parameters: guide(
    "Adding the `disabled` prop to a node's property will disable the node and prevent interaction.",
  ),
};
export const ControlledExpansion: Story = {
  name: 'ControlledExpansion',
  render: TreeViewControlledExpansion,
  parameters: guide(
    'Use the `expandedValue` and `onExpandedChange` props to programmatically control node expansion behavior.',
  ),
};
export const ExplicitExpand: Story = {
  name: 'ExplicitExpand',
  render: TreeViewExplicitExpand,
  parameters: markdownGuide(
    guide(
      'Render the `TreeView.BranchTrigger` to manually control node expansion behavior.\n\n> You might need to set `role="none"` on the `TreeView.BranchControl` to avoid accessibility issues.',
    ),
  ),
};
export const ExpandIcon: Story = {
  name: 'ExpandIcon',
  render: TreeViewExpandIcon,
  parameters: guide(
    "Use the `nodeState().expanded` value to swap the rendered icon on the branch when it's expanded or collapsed.",
  ),
};
export const RemoveIndentation: Story = {
  name: 'RemoveIndentation',
  render: TreeViewRemoveIndentation,
  parameters: guide(
    'Set the css variable `--lui-tree-indentation` to `0px` to remove the indentation of the tree view.',
  ),
};
export const LazyLoad: Story = {
  name: 'LazyLoad',
  render: TreeViewLazyLoad,
  parameters: markdownGuide(
    guide(
      'Lazy loading is a feature that allows the tree view to load children of a node on demand (or async). This helps to improve the initial load time and memory usage.\n\nTo use this, you need to provide the following:\n\n- `loadChildren` — A function that is used to load the children of a node.\n- `onLoadChildrenComplete` — A callback that is called when the children of a node are loaded. Used to update the tree collection.\n- `childrenCount` — A number that indicates the number of children of a branch node.',
    ),
  ),
};
export const Filter: Story = {
  name: 'Filter',
  render: TreeViewFilter,
  parameters: markdownGuide(
    guide(
      "Filtering is useful when you have a large tree and you want to filter the nodes to only show the ones that match the search query.\n\nHere's an example that composes the `filter` method from the `TreeCollection` and `useFilter` hook to filter the nodes.",
    ),
  ),
};
export const CollapseAnimation: Story = {
  name: 'CollapseAnimation',
  render: TreeViewCollapseAnimation,
  parameters: guide(
    'Use the `animateContent` prop to animate the tree view content expand/collapse state.',
  ),
};
export const ExpandCollapseAll: Story = {
  name: 'ExpandCollapseAll',
  render: TreeViewExpandCollapseAll,
  parameters: guide('Provide controls to expand or collapse all nodes at once.'),
};
export const Store: Story = {
  name: 'Store',
  render: TreeViewStore,
  parameters: guide(
    'Use the `useTreeView` hook to create the tree view store and pass it to the `TreeView.RootProvider` component. This allows you to have maximum control over the tree view programmatically.',
  ),
};
export const Links: Story = {
  name: 'Links',
  render: TreeViewLinks,
  parameters: guide(
    'Render the tree items as links by leveraging the `asChild` prop on the `TreeView.Item` component.',
  ),
};
export const MultiSelect: Story = {
  name: 'MultiSelect',
  render: TreeViewMultiSelect,
  parameters: markdownGuide(
    guide(
      'Add the `selectionMode="multiple"` prop to the `TreeView.Root` component to enable multi-select functionality.\n\n> This mode requires a modifier key to be pressed to select multiple items.\n>\n> - Hold `Ctrl` or `⌘` on macOS and click the items.\n> - Click an item, then hold `Shift` while clicking on another item.',
    ),
  ),
};
export const CheckboxTree: Story = {
  name: 'CheckboxTree',
  render: TreeViewCheckboxTree,
  parameters: guide('Add checkboxes to tree nodes for selection functionality.'),
};
export const Mutation: Story = {
  name: 'Mutation',
  render: TreeViewMutation,
  parameters: guide("Here's an example of how to design add/remove nodes in the tree view."),
};
export const CustomIcon: Story = {
  name: 'CustomIcon',
  render: TreeViewCustomIcon,
  parameters: guide(
    "Here's an example of how to render a custom icon for the tree view based on its data.",
  ),
};
export const ContextMenu: Story = { name: 'ContextMenu', render: TreeViewContextMenu };
export const DefaultExpanded: Story = {
  name: 'DefaultExpanded',
  render: TreeViewDefaultExpanded,
};
export const ExpandedStyling: Story = { name: 'ExpandedStyling', render: TreeViewExpandedStyling };
