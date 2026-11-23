export const emptyStateContracts = [
  {
    family: 'empty-state',
    required: [
      ...['root', 'content', 'indicator', 'title', 'description'].map(
        /** Require authored rules for every public Empty State part. */
        (part) => `.leverui-empty-state__${part}:not([data-unstyled]`,
      ),
      ...['sm', 'md', 'lg'].map(
        /** Require each finite base size. */
        (size) => `[data-size='${size}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require every finite size at each ordinary breakpoint. */
        (breakpoint) =>
          ['sm', 'md', 'lg'].map(
            /** Check the authored selector for one responsive size. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
      ),
      '--lui-empty-state-padding-inline',
      '--lui-empty-state-padding-block',
      '--lui-empty-state-gap',
      '--lui-empty-state-indicator-size',
      '--lui-empty-state-title-size',
      '--lui-colors-fg-muted',
      '--lui-colors-fg-subtle',
    ],
  },
];
