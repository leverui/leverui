/** Require QR parts, finite sizes, responsive hooks, and public variables in authored CSS. */
export const qrCodeContracts = [
  {
    family: 'qr-code',
    required: [
      '.leverui-qr-code__root',
      '.leverui-qr-code__frame',
      '.leverui-qr-code__overlay',
      "[data-size='2xs']",
      "[data-size='full']",
      "[data-size-md='xl']",
      "[data-size-2xl='full']",
      '--leverui-qr-code-size',
      '--leverui-qr-code-overlay-size',
    ],
  },
];
