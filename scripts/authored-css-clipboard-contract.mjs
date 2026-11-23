/** Require the default Clipboard icon sizing in authored CSS. */
export const clipboardContracts = [
  {
    family: 'clipboard',
    required: [
      '.lui-clipboard__root',
      '.lui-clipboard__indicator',
      ':not([data-unstyled])',
      'width: 1em',
      'height: 1em',
    ],
  },
];
