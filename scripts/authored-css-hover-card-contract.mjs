/** Guard Hover Card's public parts, responsive sizes, motion, and CSS hooks. */
export const hoverCardContracts = [
  {
    family: 'hover-card',
    required: [
      '.leverui-hoverCard__content:not([data-unstyled])',
      '.leverui-hoverCard__arrow:not([data-unstyled])',
      '.leverui-hoverCard__arrowTip:not([data-unstyled])',
      "[data-size='xs']",
      "[data-size='lg']",
      "[data-size-sm='sm']",
      "[data-size-2xl='lg']",
      "[data-state='open']",
      "[data-state='closed']",
      "[data-placement^='top']",
      "[data-placement^='right']",
      '--leverui-hover-card-background',
      '--leverui-hover-card-padding',
      '--leverui-hover-card-arrow-size',
    ],
  },
];
