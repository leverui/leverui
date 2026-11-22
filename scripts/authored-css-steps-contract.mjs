/** Require every Steps part, finite choice, state, and breakpoint in authored CSS. */
export const stepsContracts = [
  {
    family: 'steps',
    required: [
      '.leverui-steps__root:not([data-unstyled])',
      ...['list', 'item', 'trigger', 'title', 'description', 'separator', 'indicator'].map(
        /** Keep each styled public part in the default bundle. */
        (part) => `.leverui-steps__${part}:not([data-unstyled])`,
      ),
      ':is(.leverui-steps__content, .leverui-steps__completedContent):not([data-unstyled])',
      ...['xs', 'sm', 'md', 'lg'].map(
        /** Keep each size in the base stylesheet. */
        (size) => `[data-size='${size}']`,
      ),
      ...['solid', 'subtle'].map(
        /** Keep both color treatments in the base stylesheet. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require every finite choice at each supported breakpoint. */
        (breakpoint) => [`[data-size-${breakpoint}=`, `[data-variant-${breakpoint}=`],
      ),
      "[data-orientation='horizontal']",
      "[data-orientation='vertical']",
      '[data-current]',
      '[data-complete]',
      '[data-incomplete]',
      ':focus-visible',
    ],
  },
];
