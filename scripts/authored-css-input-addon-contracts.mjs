/** Keep every public Input Addon size and surface choice in the stylesheet. */
export const inputAddonContracts = [
  {
    family: 'input-addon',
    required: [
      '.lui-input-addon',
      "[data-size='2xs']",
      "[data-size='xs']",
      "[data-size='sm']",
      "[data-size='md']",
      "[data-size='lg']",
      "[data-size='xl']",
      "[data-size='2xl']",
      "[data-size-sm='md']",
      "[data-size-2xl='md']",
      "[data-variant='outline']",
      "[data-variant='subtle']",
      "[data-variant='flushed']",
      "[data-variant-sm='outline']",
      "[data-variant-2xl='outline']",
    ],
  },
];
