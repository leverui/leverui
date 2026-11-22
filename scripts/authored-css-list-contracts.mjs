export const listContracts = [
  {
    family: 'list',
    required: [
      '.leverui-list__root:not([data-unstyled])',
      ...['root', 'item', 'indicator'].map(
        /** Require each public List part hook. */
        (part) => `.leverui-list__${part}:not([data-unstyled]`,
      ),
      ...['marker', 'plain'].map(
        /** Require both finite List treatments. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['start', 'center', 'end'].map(
        /** Require each base item alignment. */
        (align) => `[data-align='${align}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require all responsive List choices. */
        (breakpoint) => [
          ...['marker', 'plain'].map(
            /** Check each responsive treatment. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
          ...['start', 'center', 'end'].map(
            /** Check each responsive item alignment. */
            (align) => `[data-align-${breakpoint}='${align}']`,
          ),
        ],
      ),
      '--leverui-colors-fg-subtle',
      '--leverui-list-gap',
      '--leverui-spacing-2',
    ],
  },
];
