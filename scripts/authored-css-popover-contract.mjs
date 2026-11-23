/** Guard Popover's public surfaces, responsive sizes, state, and CSS hooks. */
export const popoverContracts = [
  {
    family: 'popover',
    required: [
      '.leverui-popover__content:not([data-unstyled])',
      '.leverui-popover__header:not([data-unstyled])',
      '.leverui-popover__body:not([data-unstyled])',
      '.leverui-popover__footer:not([data-unstyled])',
      '.leverui-popover__arrow:not([data-unstyled])',
      '.leverui-popover__arrowTip:not([data-unstyled])',
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
