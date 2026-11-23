const styledParts = [
  'header',
  'title',
  'control',
  'footer',
  'content',
  'overlay',
  'code',
  'codeText',
];
const sizes = ['sm', 'md', 'lg'];
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

/** Guard CodeBlock's authored parts, finite sizes, and syntax states. */
export const codeBlockContracts = [
  {
    family: 'code-block',
    required: [
      '.lui-code-block__root:not([data-unstyled])',
      ...styledParts.map(
        /** Require a default CSS rule for each styled public part. */
        (part) => `.lui-code-block__${part}:not([data-unstyled])`,
      ),
      ...sizes.map(
        /** Require each scalar CodeBlock size. */
        (size) => `[data-size='${size}']`,
      ),
      ...breakpoints.flatMap(
        /** Require every finite size at the selected viewport boundary. */
        (breakpoint) =>
          sizes.map(
            /** Require this size's responsive selector. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
      ),
      '[data-has-focused]',
      '[data-has-line-numbers]',
      '[data-word-wrap]',
      "[data-diff='added']",
      "[data-diff='removed']",
      '--lui-code-block-bg',
      '--lui-code-block-padding',
    ],
  },
];
