/** Require every ordinary Card part, size, and treatment in authored CSS. */
export const cardContract = {
  family: 'card',
  required: [
    ...['root', 'header', 'body', 'footer', 'title', 'description'].map(
      /** Keep each public Card part backed by a stable CSS hook. */
      (part) => `.lui-card__${part}`,
    ),
    ...['sm', 'md', 'lg'].map(
      /** Require every authored Card root size. */
      (size) => `[data-size='${size}']`,
    ),
    ...['outline', 'elevated', 'subtle'].map(
      /** Require each authored Card root treatment. */
      (variant) => `[data-variant='${variant}']`,
    ),
    ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
      /** Require finite size and treatment choices at each breakpoint. */
      (breakpoint) => [
        ...['sm', 'md', 'lg'].map(
          /** Keep each responsive size backed by a CSS selector. */
          (size) => `[data-size-${breakpoint}='${size}']`,
        ),
        ...['elevated', 'outline', 'subtle'].map(
          /** Keep each responsive treatment backed by a CSS selector. */
          (variant) => `[data-variant-${breakpoint}='${variant}']`,
        ),
      ],
    ),
  ],
};
