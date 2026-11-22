/** Guard Marquee's authored motion, edge, and reduced-motion selectors. */
export const marqueeContracts = [
  {
    family: 'marquee',
    required: [
      '.leverui-marquee__root:not([data-unstyled])',
      '.leverui-marquee__viewport:not([data-unstyled])',
      '.leverui-marquee__content:not([data-unstyled])',
      '.leverui-marquee__edge:not([data-unstyled])',
      '[data-paused] *',
      "[data-side='start']",
      "[data-side='bottom']",
      ':dir(rtl)',
      'prefers-reduced-motion: reduce',
      '--leverui-marquee-duration',
      '--leverui-marquee-edge-color',
    ],
  },
];
