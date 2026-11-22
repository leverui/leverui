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
    '--leverui-skeleton-bg',
    '--leverui-skeleton-start-color',
    '--leverui-skeleton-end-color',
    '--leverui-skeleton-duration',
    '--leverui-skeleton-fade-duration',
    '--leverui-skeleton-text-width',
    '--leverui-skeleton-line-height',
    '--leverui-skeleton-last-line-width',
  ],
};
