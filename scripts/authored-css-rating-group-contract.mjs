/** Require every public Rating Group part and finite size selector. */
export const ratingGroupContracts = [
  {
    family: 'rating-group',
    required: [
      '.leverui-rating-group__root:not([data-unstyled])',
      '.leverui-rating-group__control:not([data-unstyled])',
      '.leverui-rating-group__item:not([data-unstyled])',
      '.leverui-rating-group__itemIndicator:not([data-unstyled])',
      '--leverui-rating-group-item-font-size',
      '--leverui-rating-group-item-line-height',
      '--leverui-rating-group-background-color',
      '--leverui-rating-group-foreground-color',
      "[data-size='xs']",
      "[data-size='sm']",
      "[data-size='md']",
      "[data-size='lg']",
      "[data-size-sm='xs']",
      "[data-size-md='md']",
      "[data-size-lg='lg']",
      "[data-size-xl='lg']",
      "[data-size-2xl='lg']",
    ],
  },
];
