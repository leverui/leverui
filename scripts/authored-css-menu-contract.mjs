const parts = [
  'content',
  'item',
  'itemText',
  'itemIndicator',
  'itemGroupLabel',
  'indicator',
  'itemCommand',
  'separator',
  'arrow',
  'arrowTip',
];
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];

/** Guard Menu's authored parts and finite presentation choices. */
export const menuContracts = [
  {
    family: 'menu',
    required: [
      ...parts.map(
        /** Require a default authored rule for every styled public part. */
        (part) => `.leverui-menu__${part}[data-leverui-menu-css]`,
      ),
      "[data-size='sm']",
      "[data-variant='solid']",
      ...breakpoints.flatMap(
        /** Require responsive selectors for both finite choices. */
        (breakpoint) => [
          `[data-size-${breakpoint}='sm']`,
          `[data-size-${breakpoint}='md']`,
          `[data-variant-${breakpoint}='subtle']`,
          `[data-variant-${breakpoint}='solid']`,
        ],
      ),
      '[data-highlighted]',
      '[data-disabled]',
    ],
  },
];
