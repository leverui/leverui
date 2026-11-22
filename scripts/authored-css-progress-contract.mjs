/** Require every public Progress part and finite presentation choice in authored CSS. */
export const progressContracts = [
  {
    family: 'progress',
    required: [
      '.leverui-progress__root',
      '.leverui-progress__track',
      '.leverui-progress__range',
      '.leverui-progress__label',
      '.leverui-progress__valueText',
      "[data-size='xs']",
      "[data-size='xl']",
      "[data-shape='square']",
      "[data-shape='full']",
      "[data-variant='outline']",
      "[data-variant='subtle']",
      "[data-striped='true']",
      "[data-animated='true']",
      "[data-size-2xl='xl']",
      "[data-variant-2xl='subtle']",
      "[data-state='indeterminate']",
      'prefers-reduced-motion',
    ],
  },
];
