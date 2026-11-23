export const skeletonContentContract = {
  family: 'skeleton',
  required: [
    '.leverui-skeleton:not([data-unstyled])',
    '.leverui-skeleton.leverui-skeleton:not([data-unstyled])[data-loading]',
    '.leverui-skeleton.leverui-circle:not([data-unstyled])[data-loading]',
    '.leverui-skeleton-text:not([data-unstyled])',
    '.leverui-skeleton-text__line:not([data-unstyled])[data-loading]',
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
