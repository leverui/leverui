const parts = [
  'area',
  'line',
  'bar',
  'gradient-start',
  'gradient-end',
  'reference-line',
  'reference-label',
  'active-guide',
  'active-point',
];
const variables = [
  'width',
  'height',
  'color',
  'area-opacity',
  'line-width',
  'reference-color',
  'label-color',
  'active-point-stroke',
];

/** Guard Sparkline's public CSS parts, variables, and gradient state. */
export const sparklineContracts = [
  {
    family: 'sparkline',
    required: [
      '.leverui-sparkline:not([data-unstyled])',
      ...parts.map(
        /** Require each SVG part's authored selector. */
        (part) => `.leverui-sparkline__${part}`,
      ),
      ...variables.map(
        /** Require every documented consumer override. */
        (name) => `--leverui-sparkline-${name}`,
      ),
      '[data-gradient]',
    ],
  },
];
