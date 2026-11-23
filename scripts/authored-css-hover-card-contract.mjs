/** Guard Hover Card's public parts, responsive sizes, motion, and CSS hooks. */
export const hoverCardContracts = [
  {
    family: 'hover-card',
    required: [
      '.lui-hoverCard__content:not([data-unstyled])',
      '.lui-hoverCard__arrow:not([data-unstyled])',
      '.lui-hoverCard__arrowTip:not([data-unstyled])',
      "[data-size='xs']",
      "[data-size='lg']",
      "[data-size-sm='sm']",
      "[data-size-2xl='lg']",
      "[data-state='open']",
      "[data-state='closed']",
      "[data-placement^='top']",
      "[data-placement^='right']",
      '--lui-hover-card-background',
      '--lui-hover-card-padding',
      '--lui-hover-card-arrow-size',
    ],
  },
];
