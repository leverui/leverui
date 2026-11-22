const styledParts = ['root', 'label', 'control', 'segmentGroup', 'segment'];
const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'];
const variants = ['outline', 'subtle', 'flushed'];
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

/** Guard Date Input's authored parts and finite presentation choices. */
export const dateInputContracts = [
  {
    family: 'date-input',
    required: [
      ...styledParts.map(
        /** Require a default authored selector for each styled public part. */
        (part) => `.leverui-date-input__${part}:not([data-unstyled])`,
      ),
      ...sizes.map(
        /** Require each scalar size rule. */
        (size) => `[data-size='${size}']`,
      ),
      ...variants.map(
        /** Require each scalar treatment rule. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...breakpoints.flatMap(
        /** Require responsive size and treatment rules. */
        (breakpoint) => [
          ...sizes.map(
            /** Require this size at the selected breakpoint. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
          ...variants.map(
            /** Require this treatment at the selected breakpoint. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
        ],
      ),
      '[data-invalid]',
      '[data-focus]',
    ],
  },
];
