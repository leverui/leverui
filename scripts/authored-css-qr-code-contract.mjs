/** Require QR parts, finite sizes, responsive hooks, and public variables in authored CSS. */
export const qrCodeContracts = [
  {
    family: 'qr-code',
    required: [
      '.lui-qr-code__root',
      '.lui-qr-code__frame',
      '.lui-qr-code__overlay',
      "[data-size='2xs']",
      "[data-size='full']",
      "[data-size-md='xl']",
      "[data-size-2xl='full']",
      '--lui-qr-code-size',
      '--lui-qr-code-overlay-size',
    ],
  },
];
