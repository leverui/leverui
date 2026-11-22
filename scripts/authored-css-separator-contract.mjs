export const separatorContentContract = {
  family: 'separator',
  required: [
    '.leverui-separator:not([data-unstyled])',
    '--leverui-separator-color',
    '--leverui-separator-thickness',
    '--leverui-private-separator-thickness',
    ...['xs', 'sm', 'md', 'lg'].map(
      /** Require every scalar thickness. */
      (size) => `[data-size='${size}']`,
    ),
    ...['solid', 'dashed', 'dotted'].map(
      /** Require every scalar border treatment. */
      (variant) => `[data-variant='${variant}']`,
    ),
    "[data-orientation='vertical']",
    ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
      /** Require all authored responsive choices at each breakpoint. */
      (breakpoint) => [
        ...['xs', 'sm', 'md', 'lg'].map(
          /** Keep size hooks aligned with the public union. */
          (size) => `[data-size-${breakpoint}='${size}']`,
        ),
        ...['solid', 'dashed', 'dotted'].map(
          /** Keep treatment hooks aligned with the public union. */
          (variant) => `[data-variant-${breakpoint}='${variant}']`,
        ),
        ...['horizontal', 'vertical'].map(
          /** Require both responsive directions, including the reset. */
          (orientation) => `[data-orientation-${breakpoint}='${orientation}']`,
        ),
      ],
    ),
  ],
};
