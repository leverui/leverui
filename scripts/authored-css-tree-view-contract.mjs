/** Require Tree View's public parts, choices, states, and CSS overrides. */
export const treeViewContracts = [
  {
    family: 'tree-view',
    required: [
      '.leverui-tree-view__root:not([data-unstyled])',
      ...[
        'branch',
        'branchContent',
        'branchControl',
        'branchIndentGuide',
        'branchIndicator',
        'branchText',
        'branchTrigger',
        'item',
        'itemText',
        'label',
        'tree',
        'nodeCheckbox',
      ].map(
        /** Keep each public compound part present in authored CSS. */
        (part) => `.leverui-tree-view__${part}`,
      ),
      '--leverui-tree-indent-size',
      '--leverui-tree-indentation',
      '--leverui-tree-icon-size',
      '--leverui-tree-padding-inline',
      '--leverui-tree-padding-block',
      '--leverui-tree-font-size',
      '--leverui-tree-line-height',
      '--leverui-tree-item-gap',
      ...['xs', 'sm'].map(
        /** Require every finite Tree View size. */
        (size) => `[data-size='${size}']`,
      ),
      "[data-variant='subtle']",
      "[data-variant='solid']",
      "[data-size-sm='xs']",
      "[data-size-md='sm']",
      "[data-size-lg='md']",
      "[data-size-xl='md']",
      "[data-size-2xl='md']",
      "[data-animate-content='true']",
      'prefers-reduced-motion: reduce',
      '[data-selected]',
      '[data-disabled]',
    ],
  },
];
