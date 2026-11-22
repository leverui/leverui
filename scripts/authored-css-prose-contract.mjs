/** Require the public Prose hook, variants, and opt-out rules in authored CSS. */
export const proseContentContract = {
  family: 'prose',
  required: [
    '.leverui-prose:not([data-unstyled])',
    "[data-size='lg']",
    '--leverui-prose-color',
    '--leverui-prose-max-width',
    '--leverui-prose-font-size',
    '--leverui-prose-line-height',
    ':not(.not-prose, .not-prose *)',
    'list-style-type: disc',
    'list-style-type: decimal',
  ],
};
