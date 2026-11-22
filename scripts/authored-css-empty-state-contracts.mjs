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
      '--leverui-empty-state-padding-inline',
      '--leverui-empty-state-padding-block',
      '--leverui-empty-state-gap',
      '--leverui-empty-state-indicator-size',
      '--leverui-empty-state-title-size',
      '--leverui-colors-fg-muted',
      '--leverui-colors-fg-subtle',
    ],
  },
];
