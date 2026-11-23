const breakpoints = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];

export const floatContracts = [
  {
    family: 'float',
    required: [
      '.leverui-float',
      '--lui-float-offset-x',
      '--lui-float-offset-y',
      ...breakpoints.flatMap(
        /** Require every axis position at each authored breakpoint. */
        (breakpoint) => [
          `[data-placement-${breakpoint}^='top-']`,
          `[data-placement-${breakpoint}^='middle-']`,
          `[data-placement-${breakpoint}^='bottom-']`,
          `[data-placement-${breakpoint}$='-start']`,
          `[data-placement-${breakpoint}$='-center']`,
          `[data-placement-${breakpoint}$='-end']`,
        ],
      ),
    ],
  },
];
