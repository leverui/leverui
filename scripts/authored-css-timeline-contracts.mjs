export const timelineContracts = [
  {
    family: 'timeline',
    required: [
      ...[
        'root',
        'item',
        'separator',
        'indicator',
        'connector',
        'content',
        'title',
        'description',
      ].map(
        /** Require every public Timeline part hook. */
        (part) => `.lui-timeline__${part}:not([data-unstyled]`,
      ),
      ...['sm', 'md', 'lg', 'xl'].map(
        /** Require every base Timeline size. */
        (size) => `[data-size='${size}']`,
      ),
      ...['subtle', 'solid', 'outline', 'plain'].map(
        /** Require every base Timeline treatment. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require each responsive Timeline size, variant, and final line. */
        (breakpoint) => [
          ...['sm', 'md', 'lg', 'xl'].map(
            /** Check this breakpoint's size selectors. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
          ...['subtle', 'solid', 'outline', 'plain'].map(
            /** Check this breakpoint's treatment selectors. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
          `[data-show-last-separator-${breakpoint}='true']`,
          `[data-show-last-separator-${breakpoint}='false']`,
        ],
      ),
      `[data-show-last-separator='true']`,
      `[data-show-last-separator='false']`,
      '--lui-colors-color-palette-solid',
      '--lui-colors-border',
    ],
  },
];
