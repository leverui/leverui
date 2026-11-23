export const breadcrumbContracts = [
  {
    family: 'breadcrumb',
    required: [
      ...['root', 'list', 'item', 'link', 'currentLink', 'separator', 'ellipsis'].map(
        /** Require every public Breadcrumb part hook. */
        (part) => `.leverui-breadcrumb__${part}:not([data-unstyled]`,
      ),
      ...['sm', 'md', 'lg'].map(
        /** Require each base list size. */
        (size) => `[data-size='${size}']`,
      ),
      ...['plain', 'underline'].map(
        /** Require both navigation treatments. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require every authored responsive selection. */
        (breakpoint) => [
          ...['sm', 'md', 'lg'].map(
            /** Check each size at this breakpoint. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
          ...['plain', 'underline'].map(
            /** Check both treatments at this breakpoint. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
        ],
      ),
      ':focus-visible',
      ':dir(rtl)',
      '--lui-colors-color-palette-fg',
      '--lui-colors-color-palette-muted',
      '--lui-colors-color-palette-focus-ring',
    ],
  },
];
