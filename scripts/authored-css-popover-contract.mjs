/** Guard Popover's public surfaces, responsive sizes, state, and CSS hooks. */
export const popoverContracts = [
  {
    family: 'popover',
    required: [
      '.lui-popover__content:not([data-unstyled])',
      '.lui-popover__header:not([data-unstyled])',
      '.lui-popover__body:not([data-unstyled])',
      '.lui-popover__footer:not([data-unstyled])',
      '.lui-popover__arrow:not([data-unstyled])',
      '.lui-popover__arrowTip:not([data-unstyled])',
      "[data-size='xs']",
      "[data-size='lg']",
      "[data-size-sm='sm']",
      "[data-size-2xl='lg']",
      "[data-state='open']",
      "[data-state='closed']",
      '--lui-popover-background',
      '--lui-popover-size',
      '--lui-popover-padding',
      '--lui-popover-arrow-size',
    ],
  },
];
