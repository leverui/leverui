/** Guard Splitter's authored handle and state selectors. */
export const splitterContracts = [
  {
    family: 'splitter',
    required: [
      '.leverui-splitter__root:not([data-unstyled])',
      '.leverui-splitter__resizeTrigger:not([data-unstyled])',
      '.leverui-splitter__resizeTriggerSeparator:not([data-unstyled])',
      '.leverui-splitter__resizeTriggerIndicator:not([data-unstyled])',
      "[data-orientation='horizontal']",
      "[data-orientation='vertical']",
      '[data-focus]',
      '[data-dragging]',
      '[data-disabled]',
      '--lui-splitter-thumb-size',
    ],
  },
];
