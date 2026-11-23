/** Require every public Rating Group part and finite size selector. */
export const ratingGroupContracts = [
  {
    family: 'rating-group',
    required: [
      '.lui-rating-group__root:not([data-unstyled])',
      '.lui-rating-group__control:not([data-unstyled])',
      '.lui-rating-group__item:not([data-unstyled])',
      '.lui-rating-group__itemIndicator:not([data-unstyled])',
      '--lui-rating-group-item-font-size',
      '--lui-rating-group-item-line-height',
      '--lui-rating-group-background-color',
      '--lui-rating-group-foreground-color',
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
