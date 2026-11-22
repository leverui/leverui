const styledParts = [
  'root',
  'label',
  'control',
  'input',
  'trigger',
  'clearTrigger',
  'indicatorGroup',
  'content',
  'item',
  'empty',
  'itemText',
  'itemIndicator',
  'itemGroup',
  'itemGroupLabel',
];
const sizes = ['xs', 'sm', 'md', 'lg'];
const variants = ['outline', 'subtle', 'flushed'];
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

/** Guard Combobox's authored parts, finite choices, and interaction states. */
export const comboboxContracts = [
  {
    family: 'combobox',
    required: [
      ...styledParts.map(
        /** Require one default authored selector per styled public part. */
        (part) => `.leverui-combobox__${part}:not([data-unstyled])`,
      ),
      ...sizes.map(
        /** Require each scalar size choice. */
        (size) => `[data-size='${size}']`,
      ),
      ...variants.map(
        /** Require each scalar variant choice. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...breakpoints.flatMap(
        /** Require responsive size and variant selectors. */
        (breakpoint) => [
          ...sizes.map(
            /** Require this size at the selected breakpoint. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
          ...variants.map(
            /** Require this variant at the selected breakpoint. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
        ],
      ),
      '[data-highlighted]',
      '[data-disabled]',
      '[data-invalid]',
      '[data-empty]',
      "[data-state='open']",
      "[data-state='closed']",
      ':focus-visible',
    ],
  },
];
