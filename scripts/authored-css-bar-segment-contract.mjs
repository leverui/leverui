const parts = [
  'root',
  'content',
  'label',
  'labelItem',
  'value',
  'valueItem',
  'legend',
  'legendItem',
  'legendSwatch',
  'legendText',
  'legendPercent',
  'bar',
  'segment',
  'tooltip',
  'tooltipSwatch',
  'reference',
  'referenceLine',
  'referenceLabel',
];

/** Guard Bar Segment's public part and variable hooks. */
export const barSegmentContracts = [
  {
    family: 'bar-segment',
    required: [
      ...parts.map(
        /** Require each styled public part in authored CSS. */
        (part) => `.leverui-bar-segment__${part}`,
      ),
      ...['size', 'root-gap', 'content-gap', 'row-gap', 'legend-gap', 'bar-gap'].map(
        /** Require each documented consumer variable. */
        (name) => `--leverui-bar-segment-${name}`,
      ),
      "[data-text-style='xs']",
      '[data-has-label]',
    ],
  },
];
