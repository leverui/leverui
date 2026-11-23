/** Guard Slider's public parts, finite choices, and state selectors. */
export const sliderContracts = [
  {
    family: 'slider',
    required: [
      '.lui-slider__root:not([data-unstyled])',
      '.lui-slider__label:not([data-unstyled])',
      '.lui-slider__control:not([data-unstyled])',
      '.lui-slider__track:not([data-unstyled])',
      '.lui-slider__range:not([data-unstyled])',
      '.lui-slider__thumb:not([data-unstyled])',
      '.lui-slider__markerGroup:not([data-unstyled])',
      '.lui-slider__marker:not([data-unstyled])',
      '.lui-slider__markerIndicator:not([data-unstyled])',
      "[data-size='sm']",
      "[data-size='lg']",
      "[data-size-sm='sm']",
      "[data-size-2xl='lg']",
      "[data-variant='solid']",
      "[data-variant-md='outline']",
      "[data-orientation='vertical']",
      '[data-disabled]',
      "[data-state='under-value']",
      '--lui-slider-thumb-size',
      '--lui-slider-track-size',
      '--lui-slider-range-color',
    ],
  },
];
