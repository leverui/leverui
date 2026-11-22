export const statusContracts = [
  {
    family: 'status',
    required: [
      '.leverui-status__root:not([data-unstyled]',
      '.leverui-status__indicator:not([data-unstyled]',
      ...['sm', 'md', 'lg'].map(
        /** Require every base Status text size. */
        (size) => `[data-size='${size}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require each finite size at all ordinary breakpoints. */
        (breakpoint) =>
          ['sm', 'md', 'lg'].map(
            /** Check one authored breakpoint selector. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
      ),
      '--leverui-colors-color-palette-solid',
      'forced-color-adjust: none',
    ],
  },
];
