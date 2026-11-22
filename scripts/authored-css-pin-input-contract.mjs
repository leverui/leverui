/** Keep every Pin Input part and attached breakpoint in authored CSS. */
export const pinInputContracts = [
  {
    family: 'pin-input',
    required: [
      '.leverui-pin-input__root',
      '.leverui-pin-input__control:not([data-unstyled])',
      '.leverui-pin-input__input.leverui-input:not([data-unstyled])',
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
