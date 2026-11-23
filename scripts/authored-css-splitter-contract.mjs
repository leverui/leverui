/** Guard Splitter's authored handle and state selectors. */
export const splitterContracts = [
  {
    family: 'splitter',
    required: [
      '.lui-splitter__root:not([data-unstyled])',
      '.lui-splitter__resizeTrigger:not([data-unstyled])',
      '.lui-splitter__resizeTriggerSeparator:not([data-unstyled])',
      '.lui-splitter__resizeTriggerIndicator:not([data-unstyled])',
      "[data-orientation='horizontal']",
      "[data-orientation='vertical']",
      '[data-focus]',
      '[data-dragging]',
      '[data-disabled]',
      '--lui-splitter-thumb-size',
    ],
  },
];
