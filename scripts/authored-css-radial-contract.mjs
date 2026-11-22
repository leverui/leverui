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
      '.leverui-radial-chart',
      ...radialParts.map(
        /** Keep every styled radial part in the shipped stylesheet. */
        (part) => `.leverui-radial-chart__${part}`,
      ),
      '--leverui-radial-chart-sector-stroke',
      '--leverui-radial-chart-label-font-size',
      '--leverui-radial-chart-legend-gap',
      "[data-placement='point']",
    ],
  },
  {
    family: 'radial-bar-chart',
    required: [
      '.leverui-radial-bar-chart',
      ...radialBarParts.map(
        /** Keep every styled radial bar part in the shipped stylesheet. */
        (part) => `.leverui-radial-bar-chart__${part}`,
      ),
      '--leverui-radial-bar-track-color',
      '--leverui-radial-bar-label-font-size',
      '--leverui-radial-bar-legend-gap',
    ],
  },
];
