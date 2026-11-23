/** Guard Tooltip's public parts, state selectors, and CSS overrides. */
export const tooltipContracts = [
  {
    family: 'tooltip',
    required: [
      '.lui-tooltip__content:not([data-unstyled])',
      '.lui-tooltip__arrow:not([data-unstyled])',
      '.lui-tooltip__arrowTip:not([data-unstyled])',
      "[data-state='open']",
      "[data-state='closed']",
      '--lui-tooltip-background',
      '--lui-tooltip-foreground',
      '--lui-tooltip-arrow-size',
    ],
  },
];
