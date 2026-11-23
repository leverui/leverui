/** Guard Tooltip's public parts, state selectors, and CSS overrides. */
export const tooltipContracts = [
  {
    family: 'tooltip',
    required: [
      '.leverui-tooltip__content:not([data-unstyled])',
      '.leverui-tooltip__arrow:not([data-unstyled])',
      '.leverui-tooltip__arrowTip:not([data-unstyled])',
      "[data-state='open']",
      "[data-state='closed']",
      '--lui-tooltip-background',
      '--lui-tooltip-foreground',
      '--lui-tooltip-arrow-size',
    ],
  },
];
