import type { GuideExplorerConfig } from './guide-explorers';
import { lazyExport } from './lazy-export';

/** Explorers for the collection and overlay guides. */
export const collectionGuideExplorers: Readonly<Record<string, GuideExplorerConfig>> = {
  combobox: {
    name: 'Combobox',
    parts: [
      'root',
      'clearTrigger',
      'content',
      'control',
      'input',
      'item',
      'itemGroup',
      'itemGroupLabel',
      'itemIndicator',
      'itemText',
      'label',
      'list',
      'positioner',
      'trigger',
      'empty',
      'indicatorGroup',
    ],
    Demo: lazyExport(
      /** Load the maintained preview only on the Combobox guide. */
      () => import('../../../demos/examples/combobox-explorer-demo'),
      'ComboboxExplorerDemo',
    ),
  },
  'hover-card': {
    name: 'Hover Card',
    parts: ['arrow', 'arrowTip', 'trigger', 'positioner', 'content'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Hover Card guide. */
      () => import('../../../demos/examples/hover-card-standard'),
      'HoverCardExplorerDemo',
    ),
  },
  listbox: {
    name: 'Listbox',
    parts: [
      'label',
      'input',
      'item',
      'itemText',
      'itemIndicator',
      'itemGroup',
      'itemGroupLabel',
      'content',
      'root',
      'valueText',
      'empty',
    ],
    Demo: lazyExport(
      /** Load the maintained preview only on the Listbox guide. */
      () => import('../../../demos/examples/listbox-gallery-explorer'),
      'ListboxExplorerDemo',
    ),
  },
  menu: {
    name: 'Menu',
    parts: [
      'arrow',
      'arrowTip',
      'content',
      'contextTrigger',
      'indicator',
      'item',
      'itemGroup',
      'itemGroupLabel',
      'itemIndicator',
      'itemText',
      'positioner',
      'separator',
      'trigger',
      'triggerItem',
      'itemCommand',
    ],
    Demo: lazyExport(
      /** Load the maintained preview only on the Menu guide. */
      () => import('../../../demos/examples/menu-explorer-demo'),
      'MenuExplorerDemo',
    ),
  },
  popover: {
    name: 'Popover',
    parts: [
      'arrow',
      'arrowTip',
      'anchor',
      'trigger',
      'positioner',
      'content',
      'title',
      'description',
      'closeTrigger',
      'header',
      'body',
      'footer',
    ],
    Demo: lazyExport(
      /** Load the maintained preview only on the Popover guide. */
      () => import('../../../demos/examples/popover-explorer-demo'),
      'PopoverExplorerDemo',
    ),
  },
  select: {
    name: 'Select',
    parts: [
      'label',
      'positioner',
      'trigger',
      'indicator',
      'clearTrigger',
      'item',
      'itemText',
      'itemIndicator',
      'itemGroup',
      'itemGroupLabel',
      'list',
      'content',
      'root',
      'control',
      'valueText',
      'indicatorGroup',
    ],
    Demo: lazyExport(
      /** Load the maintained preview only on the Select guide. */
      () => import('../../../demos/examples/select-explorer-demo'),
      'SelectExplorerDemo',
    ),
  },
  tooltip: {
    name: 'Tooltip',
    parts: ['trigger', 'arrow', 'arrowTip', 'positioner', 'content'],
    Demo: lazyExport(
      /** Load the maintained preview only on the Tooltip guide. */
      () => import('../../../demos/examples/tooltip-standard'),
      'TooltipExplorerDemo',
    ),
  },
  'tree-view': {
    name: 'TreeView',
    parts: [
      'branch',
      'branchContent',
      'branchControl',
      'branchIndentGuide',
      'branchIndicator',
      'branchText',
      'branchTrigger',
      'item',
      'itemIndicator',
      'itemText',
      'label',
      'nodeCheckbox',
      'root',
      'tree',
    ],
    Demo: lazyExport(
      /** Load the maintained preview only on the Tree View guide. */
      () => import('../../../demos/examples/tree-view-gallery-explorer'),
      'TreeViewExplorerDemo',
    ),
  },
};
