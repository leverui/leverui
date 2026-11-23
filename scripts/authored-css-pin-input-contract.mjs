/** Keep every Pin Input part and attached breakpoint in authored CSS. */
export const pinInputContracts = [
  {
    family: 'pin-input',
    required: [
      '.lui-pin-input__root',
      '.lui-pin-input__control:not([data-unstyled])',
      '.lui-pin-input__input.lui-input:not([data-unstyled])',
      "[data-attached='true']",
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require both attached states so later breakpoints can reverse one. */
        (breakpoint) =>
          ['true', 'false'].map(
            /** Identify one finite selector in the authored CSS bundle. */
            (attached) => `[data-attached-${breakpoint}='${attached}']`,
          ),
      ),
    ],
  },
];
