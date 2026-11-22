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
      '--leverui-tooltip-background',
      '--leverui-tooltip-foreground',
      '--leverui-tooltip-arrow-size',
    ],
  },
];
