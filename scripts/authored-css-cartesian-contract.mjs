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
        (part) => `.lui-cartesian-chart__${part}`,
      ),
      '--lui-cartesian-chart-min-width',
      '--lui-cartesian-chart-legend-gap',
      '--lui-cartesian-chart-tooltip-bg',
      '[data-muted]',
      "[data-position='right']",
    ],
  },
  { family: 'area-chart', required: ['.lui-area-chart .lui-cartesian-chart__area'] },
  { family: 'line-chart', required: ['.lui-line-chart .lui-cartesian-chart__line'] },
];
