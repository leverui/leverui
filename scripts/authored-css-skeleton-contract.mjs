export const skeletonContentContract = {
  family: 'skeleton',
  required: [
    '.lui-skeleton:not([data-unstyled])',
    '.lui-skeleton.lui-skeleton:not([data-unstyled])[data-loading]',
    '.lui-skeleton.lui-circle:not([data-unstyled])[data-loading]',
    '.lui-skeleton-text:not([data-unstyled])',
    '.lui-skeleton-text__line:not([data-unstyled])[data-loading]',
    '[data-last-line]',
    ...['shine', 'none'].map(
      /** Require every public scalar motion treatment. */
      (variant) => `[data-variant='${variant}']`,
    ),
    ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
      /** Require each authored responsive treatment. */
      (breakpoint) =>
        ['pulse', 'shine', 'none'].map(
          /** Match every finite variant at the selected breakpoint. */
          (variant) => `[data-variant-${breakpoint}='${variant}']`,
        ),
    ),
    '--lui-skeleton-bg',
    '--lui-skeleton-start-color',
    '--lui-skeleton-end-color',
    '--lui-skeleton-duration',
    '--lui-skeleton-fade-duration',
    '--lui-skeleton-text-width',
    '--lui-skeleton-line-height',
    '--lui-skeleton-last-line-width',
  ],
};
