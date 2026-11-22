export const checkboxIndicatorContracts = [
  {
    family: 'checkbox-indicator',
    required: [
      '.leverui-checkbox__indicator:not([data-unstyled])',
      '.leverui-checkbox__control .leverui-checkbox__indicator:not([data-unstyled])',
      'stroke-width: 3px',
      "[data-state='indeterminate'] [data-glyph='indeterminate']",
      "[data-state='checked'] [data-glyph='checked']",
    ],
  },
];
