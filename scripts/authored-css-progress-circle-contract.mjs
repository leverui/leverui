/** Require Circle SVG hooks, finite sizes, and reduced-motion presentation in authored CSS. */
export const progressCircleContracts = [
  {
    family: 'progress-circle',
    required: [
      '.leverui-progress-circle__root',
      '.leverui-progress-circle__circle',
      '.leverui-progress-circle__circleTrack',
      '.leverui-progress-circle__circleRange',
      '.leverui-progress-circle__label',
      '.leverui-progress-circle__valueText',
      "[data-size='xs']",
      "[data-size='xl']",
      "[data-size-2xl='xl']",
      "[data-state='indeterminate']",
      'prefers-reduced-motion',
      '--lui-progress-circle-size',
      '--lui-progress-circle-thickness',
      '--lui-progress-circle-range-color',
    ],
  },
];
