/** Require Collapsible's styled content and both presence states in authored CSS. */
export const collapsibleContracts = [
  {
    family: 'collapsible',
    required: [
      '.leverui-collapsible__root',
      '.leverui-collapsible__content',
      "[data-state='open']",
      "[data-state='closed']",
      '[data-has-collapsed-size]',
      'animation-name: expand-height, fade-in',
      'animation-name: collapse-height, fade-out',
    ],
  },
];
