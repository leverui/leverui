/** Guard Marquee's authored motion, edge, and reduced-motion selectors. */
export const marqueeContracts = [
  {
    family: 'marquee',
    required: [
      '.lui-marquee__root:not([data-unstyled])',
      '.lui-marquee__viewport:not([data-unstyled])',
      '.lui-marquee__content:not([data-unstyled])',
      '.lui-marquee__edge:not([data-unstyled])',
      '[data-paused] *',
      "[data-side='start']",
      "[data-side='bottom']",
      ':dir(rtl)',
      'prefers-reduced-motion: reduce',
      '--lui-marquee-duration',
      '--lui-marquee-edge-color',
    ],
  },
];
