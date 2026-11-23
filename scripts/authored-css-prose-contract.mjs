/** Require the public Prose hook, variants, and opt-out rules in authored CSS. */
export const proseContentContract = {
  family: 'prose',
  required: [
    '.lui-prose:not([data-unstyled])',
    "[data-size='lg']",
    '--lui-prose-color',
    '--lui-prose-max-width',
    '--lui-prose-font-size',
    '--lui-prose-line-height',
    ':not(.not-prose, .not-prose *)',
    'list-style-type: disc',
    'list-style-type: decimal',
  ],
};
