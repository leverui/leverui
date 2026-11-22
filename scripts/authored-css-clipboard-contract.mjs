/** Require the default Clipboard icon sizing in authored CSS. */
export const clipboardContracts = [
  {
    family: 'clipboard',
    required: [
      '.leverui-clipboard__root',
      '.leverui-clipboard__indicator',
      ':not([data-unstyled])',
      'width: 1em',
      'height: 1em',
    ],
  },
];
