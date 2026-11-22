export const statContracts = [
  {
    family: 'stat',
    required: [
      ...['root', 'label', 'helpText', 'valueUnit', 'valueText', 'indicator'].map(
        /** Require each native Stat part's public hook. */
        (part) => `.leverui-stat__${part}:not([data-unstyled]`,
      ),
      ...['sm', 'md', 'lg'].map(
        /** Require every base Stat value size. */
        (size) => `[data-size='${size}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require every responsive Stat size selector. */
        (breakpoint) =>
          ['sm', 'md', 'lg'].map(
            /** Check one finite size at the requested breakpoint. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
      ),
      "[data-type='up']",
      "[data-type='down']",
      '--leverui-colors-fg-muted',
      '--leverui-colors-fg-success',
      '--leverui-colors-fg-error',
    ],
  },
];
