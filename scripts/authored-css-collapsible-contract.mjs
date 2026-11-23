/** Require Collapsible's styled content and both presence states in authored CSS. */
export const collapsibleContracts = [
  {
    family: 'collapsible',
    required: [
      '.lui-collapsible__root',
      '.lui-collapsible__content',
      "[data-state='open']",
      "[data-state='closed']",
      '[data-has-collapsed-size]',
      'animation-name: expand-height, fade-in',
      'animation-name: collapse-height, fade-out',
    ],
  },
];
