export const dataListContracts = [
  {
    family: 'data-list',
    required: [
      ...['root', 'item', 'itemLabel', 'itemValue'].map(
        /** Require every public Data List part. */
        (part) => `.leverui-data-list__${part}:not([data-unstyled]`,
      ),
      ...['sm', 'md', 'lg'].map(
        /** Require each base size. */
        (size) => `[data-size='${size}']`,
      ),
      ...['vertical', 'horizontal'].map(
        /** Require both flow directions. */
        (orientation) => `[data-orientation='${orientation}']`,
      ),
      ...['subtle', 'bold'].map(
        /** Require both emphasis treatments. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require finite choices at every ordinary breakpoint. */
        (breakpoint) => [
          ...['sm', 'md', 'lg'].map(
            /** Check each responsive size. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
          ...['vertical', 'horizontal'].map(
            /** Check each responsive flow direction. */
            (orientation) => `[data-orientation-${breakpoint}='${orientation}']`,
          ),
          ...['subtle', 'bold'].map(
            /** Check each responsive emphasis treatment. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
        ],
      ),
      '--lui-colors-fg-muted',
      '--lui-font-weights-medium',
    ],
  },
];
