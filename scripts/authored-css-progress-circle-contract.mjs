/** Require Circle SVG hooks, finite sizes, and reduced-motion presentation in authored CSS. */
export const progressCircleContracts = [
  {
    family: 'progress-circle',
    required: [
      '.lui-progress-circle__root',
      '.lui-progress-circle__circle',
      '.lui-progress-circle__circleTrack',
      '.lui-progress-circle__circleRange',
      '.lui-progress-circle__label',
      '.lui-progress-circle__valueText',
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
