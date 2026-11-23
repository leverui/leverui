/** Require Image's finite fit and open position rules at each breakpoint. */
export const imageLayoutContract = {
  family: 'image',
  required: [
    '.lui-image:not([data-unstyled])',
    '--lui-image-fit',
    '--lui-image-position',
    ...['base', 'sm', 'md', 'lg', 'xl', '2xl'].flatMap(
      /** Require all supported fit selectors and the position variable. */
      (breakpoint) => [
        `--lui-private-image-align-${breakpoint}`,
        ...['cover', 'contain', 'fill', 'none', 'scale-down'].map(
          /** Require one selector for this fit and breakpoint. */
          (fit) => `[data-fit-${breakpoint}='${fit}']`,
        ),
      ],
    ),
  ],
};
