export const checkboxIndicatorContracts = [
  {
    family: 'checkbox-indicator',
    required: [
      '.lui-checkbox__indicator:not([data-unstyled])',
      '.lui-checkbox__control .lui-checkbox__indicator:not([data-unstyled])',
      'stroke-width: 3px',
      "[data-state='indeterminate'] [data-glyph='indeterminate']",
      "[data-state='checked'] [data-glyph='checked']",
    ],
  },
];
