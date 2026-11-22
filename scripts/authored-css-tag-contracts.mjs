export const tagContracts = [
  {
    family: 'tag',
    required: [
      ...['root', 'label', 'startElement', 'endElement', 'closeTrigger'].map(
        /** Require every public Tag part hook. */
        (part) => `.leverui-tag__${part}:not([data-unstyled]`,
      ),
      ...['sm', 'md', 'lg', 'xl'].map(
        /** Require every base Tag size. */
        (size) => `[data-size='${size}']`,
      ),
      ...['subtle', 'solid', 'outline', 'surface'].map(
        /** Require every base Tag treatment. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require all ordinary responsive Tag choices. */
        (breakpoint) => [
          ...['sm', 'md', 'lg', 'xl'].map(
            /** Check this breakpoint's size selectors. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
          ...['subtle', 'solid', 'outline', 'surface'].map(
            /** Check this breakpoint's treatment selectors. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
        ],
      ),
      ':has([data-avatar-root])',
      ':focus-visible',
      '--leverui-colors-color-palette-focus-ring',
      '--leverui-colors-color-palette-solid',
    ],
  },
];
