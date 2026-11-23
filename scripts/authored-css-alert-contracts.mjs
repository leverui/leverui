/** Require the Alert root, parts, and finite presentation choices. */
export const alertContracts = [
  {
    family: 'alert',
    required: [
      '.lui-alert__root',
      '.lui-alert__title',
      '.lui-alert__description',
      '.lui-alert__indicator',
      '.lui-alert__content',
      "[data-inline='true']",
      ...['sm', 'md', 'lg'].map(
        /** Identify one authored Alert size selector. */
        (size) => `[data-size='${size}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].map(
        /** Require a media rule for each responsive size breakpoint. */
        (breakpoint) => `[data-size-${breakpoint}=`,
      ),
      ...['subtle', 'surface', 'outline', 'solid'].map(
        /** Identify one authored Alert variant selector. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require responsive variant and inline selectors at each breakpoint. */
        (breakpoint) => [`[data-variant-${breakpoint}=`, `[data-inline-${breakpoint}=`],
      ),
      ...['info', 'warning', 'success', 'error', 'neutral'].flatMap(
        /** Require every status at the base and each responsive breakpoint. */
        (status) => [
          `[data-status='${status}']`,
          ...['sm', 'md', 'lg', 'xl', '2xl'].map(
            /** Identify one responsive status selector. */
            (breakpoint) => `[data-status-${breakpoint}='${status}']`,
          ),
        ],
      ),
    ],
  },
];
