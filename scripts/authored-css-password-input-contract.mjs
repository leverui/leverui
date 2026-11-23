/** Require native CSS hooks for the visibility trigger and strength meter. */
export const passwordInputContracts = [
  {
    family: 'password-input',
    required: [
      '.leverui-password-input:not([data-unstyled])',
      '.leverui-password-input__visibility-trigger',
      '.leverui-password-strength-meter__track',
      '.leverui-password-strength-meter__segment',
      '.leverui-password-strength-meter__label',
      "[data-strength-level='low']",
      "[data-strength-level='medium']",
      "[data-strength-level='high']",
      '[data-selected]',
      '--lui-password-strength-selected-background',
      '--lui-password-strength-unselected-background',
      '--lui-password-strength-segment-height',
      '--lui-password-strength-segment-radius',
      '--lui-password-strength-label-font-size',
      '--lui-password-strength-label-line-height',
    ],
  },
];
