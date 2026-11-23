export const shapeContracts = [
  {
    family: 'square',
    required: [
      ':is(.lui-square, .lui-circle)',
      ':is(.lui-square, .lui-circle):not([data-unstyled])',
      '--lui-square-size',
      ...['base', 'sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require both dimensions at every ordinary breakpoint. */
        (breakpoint) => [
          `width: var(--lui-private-square-size-${breakpoint}, var(--lui-square-size, auto))`,
          `height: var(--lui-private-square-size-${breakpoint}, var(--lui-square-size, auto))`,
        ],
      ),
    ],
  },
  {
    family: 'circle',
    required: ['.lui-circle:not([data-unstyled])', '--lui-circle-radius'],
  },
];
