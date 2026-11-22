export const shapeContracts = [
  {
    family: 'square',
    required: [
      ':is(.leverui-square, .leverui-circle)',
      ':is(.leverui-square, .leverui-circle):not([data-unstyled])',
      '--leverui-square-size',
      ...['base', 'sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require both dimensions at every ordinary breakpoint. */
        (breakpoint) => [
          `width: var(--leverui-private-square-size-${breakpoint}, var(--leverui-square-size, auto))`,
          `height: var(--leverui-private-square-size-${breakpoint}, var(--leverui-square-size, auto))`,
        ],
      ),
    ],
  },
  {
    family: 'circle',
    required: ['.leverui-circle:not([data-unstyled])', '--leverui-circle-radius'],
  },
];
