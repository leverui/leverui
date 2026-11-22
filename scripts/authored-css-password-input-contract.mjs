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
      '--leverui-password-strength-selected-background',
      '--leverui-password-strength-unselected-background',
      '--leverui-password-strength-segment-height',
      '--leverui-password-strength-segment-radius',
      '--leverui-password-strength-label-font-size',
      '--leverui-password-strength-label-line-height',
    ],
  },
];
