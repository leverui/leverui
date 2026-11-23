/** Verify Native Select parts and finite choices remain styled. */
export const nativeSelectContracts = [
  {
    family: 'native-select',
    required: [
      '.lui-native-select__root:not([data-unstyled])',
      '.lui-native-select__field:not([data-unstyled])',
      '.lui-native-select__indicator:not([data-unstyled])',
      "[data-size='xs']",
      "[data-size='xl']",
      "[data-size-sm='md']",
      "[data-size-2xl='md']",
      "[data-variant='outline']",
      "[data-variant='ghost']",
      "[data-variant-sm='subtle']",
      "[data-variant-2xl='plain']",
      '[data-invalid]',
      ':focus-visible',
    ],
  },
];
