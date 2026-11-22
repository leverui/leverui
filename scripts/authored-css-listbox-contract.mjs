const styledParts = [
  'root',
  'content',
  'empty',
  'item',
  'itemGroup',
  'itemGroupLabel',
  'itemIndicator',
  'itemText',
  'label',
  'valueText',
];
const variants = ['subtle', 'solid', 'plain'];
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

/** Guard Listbox's styled parts and finite variant selectors. */
export const listboxContracts = [
  {
    family: 'listbox',
    required: [
      ...styledParts.map(
        /** Require an authored rule for each styled public part. */
        (part) => `.leverui-listbox__${part}:not([data-unstyled])`,
      ),
      ...variants.map(
        /** Require each scalar treatment rule. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...breakpoints.flatMap(
        /** Require each treatment at this breakpoint. */
        (breakpoint) =>
          variants.map(
            /** Require this responsive treatment selector. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
      ),
      '[data-highlighted]',
      '[data-disabled]',
    ],
  },
];
