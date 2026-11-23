const parts = [
  'root',
  'label',
  'control',
  'indicator',
  'input',
  'clearTrigger',
  'list',
  'item',
  'itemText',
  'itemCommand',
  'itemGroup',
  'itemGroupLabel',
  'empty',
  'loading',
  'separator',
  'footer',
];
const sizes = ['sm', 'md', 'lg'];
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

/** Guard Command's public parts, finite sizes, and machine states. */
export const commandContracts = [
  {
    family: 'command',
    required: [
      ...parts.map(
        /** Require authored presentation for every public part. */
        (part) => `.lui-command__${part}:not([data-unstyled])`,
      ),
      ...sizes.map(
        /** Require each scalar size. */
        (size) => `[data-size='${size}']`,
      ),
      ...breakpoints.flatMap(
        /** Require each size at every supported breakpoint. */
        (breakpoint) =>
          sizes.map(
            /** Keep responsive size selectors complete. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
      ),
      '[data-highlighted]',
      '[data-disabled]',
      '--lui-command-background',
      '--lui-command-radius',
    ],
  },
];
