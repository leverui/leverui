/** Require Card's public hooks and every finite size and surface selector. */
export const cardContracts = [
  {
    family: 'card',
    required: [
      ...['root', 'header', 'body', 'footer', 'title', 'description'].map(
        /** Check each public Card part in its authored CSS source. */
        (part) => `.lui-card__${part}:not([data-unstyled])`,
      ),
      ...['sm', 'md', 'lg'].map(
        /** Check every scalar Card size. */
        (size) => `[data-size='${size}']`,
      ),
      ...['elevated', 'outline', 'subtle'].map(
        /** Check every scalar Card treatment. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Check each ordinary responsive size and treatment. */
        (breakpoint) => [
          ...['sm', 'md', 'lg'].map(
            /** Keep responsive size coverage aligned with the public choices. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
          ...['elevated', 'outline', 'subtle'].map(
            /** Keep responsive surface coverage aligned with the public choices. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
        ],
      ),
      '--lui-card-padding',
    ],
  },
];
