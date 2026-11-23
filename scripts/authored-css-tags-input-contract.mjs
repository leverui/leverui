/** Require every visible Tags Input part and finite appearance selector. */
export const tagsInputContracts = [
  {
    family: 'tags-input',
    required: [
      '.lui-tags-input__root:not([data-unstyled])',
      ...[
        'label',
        'control',
        'input',
        'item',
        'itemText',
        'itemInput',
        'itemPreview',
        'itemDeleteTrigger',
        'clearTrigger',
      ].map(
        /** Keep all styled compound parts in the public CSS bundle. */
        (part) => `.lui-tags-input__${part}:not([data-unstyled])`,
      ),
      ...['xs', 'sm', 'md', 'lg'].map(
        /** Require each base size selector. */
        (size) => `[data-size='${size}']`,
      ),
      ...['outline', 'subtle', 'flushed'].map(
        /** Require each base treatment. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require all finite choices at each supported breakpoint. */
        (breakpoint) => [
          ...['xs', 'sm', 'md', 'lg'].map(
            /** Keep responsive size selectors complete. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
          ...['outline', 'subtle', 'flushed'].map(
            /** Keep responsive variant selectors complete. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
        ],
      ),
      '[data-invalid]',
      '[data-readonly]',
      ':focus',
    ],
  },
];
