const sizes = ['xs', 'sm', 'md', 'lg'];
const variants = ['solid', 'subtle', 'outline', 'inverted'];

export const radiomarkContracts = [
  {
    family: 'radiomark',
    required: [
      '.leverui-radiomark:not([data-unstyled])',
      '.leverui-radiomark__dot',
      ...sizes.map(
        /** Require every finite mark size. */
        (size) => `[data-size='${size}']`,
      ),
      ...variants.map(
        /** Require every finite surface treatment. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require responsive size, treatment, and fill hooks. */
        (breakpoint) => [
          ...sizes.map(
            /** Require this size at the current breakpoint. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
          ...variants.map(
            /** Require this treatment at the current breakpoint. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
          `[data-filled-${breakpoint}='true']`,
          `[data-filled-${breakpoint}='false']`,
        ],
      ),
      '[data-checked]',
      '[data-filled]',
      '[data-disabled]',
      '[data-invalid]',
      "[aria-invalid='true']",
      ':focus-visible',
    ],
  },
];
