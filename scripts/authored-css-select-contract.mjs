const styledParts = [
  'root',
  'control',
  'trigger',
  'valueText',
  'indicatorGroup',
  'indicator',
  'content',
  'item',
  'itemText',
  'itemGroup',
  'itemGroupLabel',
  'label',
  'clearTrigger',
];
const sizes = ['xs', 'sm', 'md', 'lg'];
const variants = ['outline', 'subtle', 'ghost'];
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

/** Guard Select's authored parts and all finite size and treatment choices. */
export const selectContracts = [
  {
    family: 'select',
    required: [
      ...styledParts.map(
        /** Require a default authored selector for every styled public part. */
        (part) => `.leverui-select__${part}:not([data-unstyled])`,
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
        /** Require every responsive size and treatment. */
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
      ':focus-visible',
    ],
  },
];
