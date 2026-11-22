/** Require each public Accordion part and finite appearance choice in CSS. */
export const accordionContracts = [
  {
    family: 'accordion',
    required: [
      ...['root', 'item', 'itemTrigger', 'itemContent', 'itemBody', 'itemIndicator'].map(
        /** Identify one public part selector. */
        (part) => `.leverui-accordion__${part}`,
      ),
      ...['sm', 'md', 'lg'].map(
        /** Identify a base size. */
        (size) => `[data-size='${size}']`,
      ),
      ...['outline', 'subtle', 'enclosed', 'plain'].map(
        /** Identify a base treatment. */
        (variant) => `[data-variant='${variant}']`,
      ),
      ...['sm', 'md', 'lg', 'xl', '2xl'].flatMap(
        /** Require size and treatment at every supported breakpoint. */
        (breakpoint) => [`[data-size-${breakpoint}=`, `[data-variant-${breakpoint}=`],
      ),
      "[data-state='open']",
      "[data-state='closed']",
      '[data-disabled]',
    ],
  },
];
