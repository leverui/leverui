/** Require Avatar's public slots and every finite CSS appearance choice. */
export const avatarContracts = [
  {
    family: 'avatar',
    required: [
      ...['root', 'image', 'fallback'].map(
        /** Identify one styled public part. */
        (part) => `.leverui-avatar__${part}`,
      ),
      ...['full', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'].map(
        /** Require every base size. */
        (size) => `[data-size='${size}']`,
      ),
      ...['solid', 'subtle', 'outline'].map(
        /** Require every base surface. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['square', 'rounded', 'full'].map(
        /** Require every base shape. */
        (shape) => `[data-shape='${shape}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require responsive hooks for all three finite dimensions. */
        (breakpoint) => [
          `[data-size-${breakpoint}=`,
          `[data-variant-${breakpoint}=`,
          `[data-shape-${breakpoint}=`,
        ],
      ),
      "[data-borderless='true']",
      "[data-borderless='false']",
      ...['sm', 'md', 'lg', 'xl', '2xl'].map(
        /** Require every responsive group-border selector. */
        (breakpoint) => `[data-borderless-${breakpoint}=`,
      ),
      '[data-leverui-group-item]',
    ],
  },
];
