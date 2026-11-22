const parts = [
  'root',
  'svg',
  'axes',
  'rightAxis',
  'gridLine',
  'axisTitle',
  'series',
  'pointLabel',
  'interaction',
  'cursor',
  'legend',
  'legendItem',
  'legendSwatch',
  'tooltip',
  'tooltipItem',
  'tooltipSwatch',
];

/** Guard the shared Area/Line stylesheet and each family-specific rule. */
export const cartesianContracts = [
  {
    family: 'cartesian-chart',
    required: [
      ...parts.map(
        /** Keep fixed Cartesian presentation in authored CSS. */
        (part) => `.leverui-cartesian-chart__${part}`,
      ),
      '--leverui-cartesian-chart-min-width',
      '--leverui-cartesian-chart-legend-gap',
      '--leverui-cartesian-chart-tooltip-bg',
      '[data-muted]',
      "[data-position='right']",
    ],
  },
  { family: 'area-chart', required: ['.leverui-area-chart .leverui-cartesian-chart__area'] },
  { family: 'line-chart', required: ['.leverui-line-chart .leverui-cartesian-chart__line'] },
];
