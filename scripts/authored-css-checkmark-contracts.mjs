export const checkmarkContracts = [
  {
    family: 'checkmark',
    required: [
      '.leverui-checkmark:not([data-unstyled])',
      ...['xs', 'sm', 'md', 'lg'].map(
        /** Require each finite SVG size. */
        (size) => `[data-size='${size}']`,
      ),
      ...['solid', 'outline', 'subtle', 'plain', 'inverted'].map(
        /** Require each finite surface treatment. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require size, treatment, and fill overrides at every breakpoint. */
        (breakpoint) => [
          `[data-size-${breakpoint}='xs']`,
          `[data-size-${breakpoint}='lg']`,
          `[data-variant-${breakpoint}='solid']`,
          `[data-variant-${breakpoint}='inverted']`,
          `[data-filled-${breakpoint}='true']`,
          `[data-filled-${breakpoint}='false']`,
        ],
      ),
      "[data-state='checked']",
      "[data-state='indeterminate']",
      '[data-disabled]',
      '[data-invalid]',
      ':focus-visible',
    ],
  },
];
