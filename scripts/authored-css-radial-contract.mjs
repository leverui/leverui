const radialParts = [
  'svg',
  'sector',
  'labelLine',
  'label',
  'center',
  'centerTitle',
  'centerDescription',
  'legend',
  'legendItem',
  'legendSwatch',
];

const radialBarParts = ['svg', 'track', 'label', 'legend', 'legendItem', 'legendSwatch'];

/** Guard the authored selectors and consumer variables for both radial families. */
export const radialContracts = [
  {
    family: 'radial-chart',
    required: [
      '.lui-radial-chart',
      ...radialParts.map(
        /** Keep every styled radial part in the shipped stylesheet. */
        (part) => `.lui-radial-chart__${part}`,
      ),
      '--lui-radial-chart-sector-stroke',
      '--lui-radial-chart-label-font-size',
      '--lui-radial-chart-legend-gap',
      "[data-placement='point']",
    ],
  },
  {
    family: 'radial-bar-chart',
    required: [
      '.lui-radial-bar-chart',
      ...radialBarParts.map(
        /** Keep every styled radial bar part in the shipped stylesheet. */
        (part) => `.lui-radial-bar-chart__${part}`,
      ),
      '--lui-radial-bar-track-color',
      '--lui-radial-bar-label-font-size',
      '--lui-radial-bar-legend-gap',
    ],
  },
];
