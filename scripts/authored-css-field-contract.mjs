/** Require every public Field part and orientation selector in authored CSS. */
export const fieldContracts = [
  {
    family: 'field',
    required: [
      '.leverui-field__root:not([data-unstyled])',
      '.leverui-field__label:not([data-unstyled])',
      '.leverui-field__helperText:not([data-unstyled])',
      '.leverui-field__errorText:not([data-unstyled])',
      '.leverui-field__requiredIndicator:not([data-unstyled])',
      '--lui-field-label-width',
      "[data-orientation='vertical']",
      "[data-orientation='horizontal']",
      "[data-orientation-sm='vertical']",
      "[data-orientation-sm='horizontal']",
      "[data-orientation-md='vertical']",
      "[data-orientation-md='horizontal']",
      "[data-orientation-lg='vertical']",
      "[data-orientation-lg='horizontal']",
      "[data-orientation-xl='vertical']",
      "[data-orientation-xl='horizontal']",
      "[data-orientation-2xl='vertical']",
      "[data-orientation-2xl='horizontal']",
    ],
  },
];
