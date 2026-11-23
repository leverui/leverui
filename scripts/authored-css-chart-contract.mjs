const barParts = [
  'svg',
  'axes',
  'grid-line',
  'axis-line',
  'bar-label',
  'wick',
  'reference-area',
  'reference-label',
  'reference-line',
  'legend',
  'legend-item',
  'legend-swatch',
  'tooltip',
];

const radarParts = [
  'svg',
  'grid',
  'ring',
  'angle-label',
  'radius-label',
  'shape',
  'point-label',
  'legend',
  'legend-item',
  'legend-swatch',
];

const scatterParts = [
  'svg',
  'axes',
  'tick-label',
  'cursor',
  'trend',
  'connection',
  'legend',
  'legend-swatch',
];

/** Guard authored CSS hooks for independent Cartesian and polar charts. */
export const chartContracts = [
  {
    family: 'bar-chart',
    required: [
      '.leverui-bar-chart:not([data-unstyled])',
      ...barParts.map(
        /** Keep fixed Bar Chart presentation in the stylesheet. */
        (part) => `.leverui-bar-chart__${part}`,
      ),
      '--lui-bar-chart-axis-font-size',
      '--lui-bar-chart-legend-gap',
      '--lui-bar-chart-tooltip-background',
      "[data-placement='top-right']",
    ],
  },
  {
    family: 'radar-chart',
    required: [
      '.leverui-radar-chart',
      ...radarParts.map(
        /** Keep fixed Radar Chart presentation in the stylesheet. */
        (part) => `.leverui-radar-chart__${part}`,
      ),
      '--lui-radar-chart-grid-stroke',
      '--lui-radar-chart-legend-gap',
    ],
  },
  {
    family: 'scatter-chart',
    required: [
      '.leverui-scatter-chart',
      ...scatterParts.map(
        /** Keep fixed Scatter Chart presentation in the stylesheet. */
        (part) => `.leverui-scatter-chart__${part}`,
      ),
      '--lui-scatter-chart-axis-stroke',
      '--lui-scatter-chart-legend-gap',
    ],
  },
];
