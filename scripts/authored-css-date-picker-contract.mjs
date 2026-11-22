const styledParts = [
  'root',
  'input',
  'control',
  'label',
  'indicatorGroup',
  'trigger',
  'clearTrigger',
  'content',
  'view',
  'viewControl',
  'viewTrigger',
  'prevTrigger',
  'nextTrigger',
  'rangeText',
  'monthSelect',
  'yearSelect',
  'table',
  'tableHeader',
  'tableCell',
  'tableCellTrigger',
  'weekNumberCell',
  'weekNumberHeaderCell',
];
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
const variants = ['outline', 'subtle', 'flushed'];
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

/** Guard Date Picker's public part, finite choice, and calendar state rules. */
export const datePickerContracts = [
  {
    family: 'date-picker',
    required: [
      ...styledParts.map(
        /** Require an authored selector for each styled public part. */
        (part) => `.leverui-date-picker__${part}`,
      ),
      ...sizes.map(
        /** Require each scalar size choice. */
        (size) => `[data-size='${size}']`,
      ),
      ...variants.map(
        /** Require each scalar treatment choice. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...breakpoints.flatMap(
        /** Require size and treatment at every supported breakpoint. */
        (breakpoint) => [
          ...sizes.map(
            /** Require this responsive size. */
            (size) => `[data-size-${breakpoint}='${size}']`,
          ),
          ...variants.map(
            /** Require this responsive treatment. */
            (variant) => `[data-variant-${breakpoint}='${variant}']`,
          ),
        ],
      ),
      '[data-selected]',
      '[data-in-range]',
      '[data-today]',
      '[data-disabled]',
      "[data-hide-outside-days='true']",
      ...breakpoints.flatMap(
        /** Require responsive outside-day hiding and reversal. */
        (breakpoint) => [
          `[data-hide-outside-days-${breakpoint}='true']`,
          `[data-hide-outside-days-${breakpoint}='false']`,
        ],
      ),
    ],
  },
];
