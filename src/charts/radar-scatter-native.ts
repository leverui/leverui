/** Radar-only props excluded from its native div boundary. */
export const radarChartKeys = [
  'data',
  'series',
  'width',
  'height',
  'maxValue',
  'grid',
  'angleLabels',
  'radiusLabels',
  'legend',
  'linesOnly',
  'dots',
  'pointLabels',
  'tooltip',
  'ref',
] as const;

/** Scatter-only props excluded from its native div boundary. */
export const scatterChartKeys = [
  'data',
  'xKey',
  'yKey',
  'series',
  'height',
  'topInset',
  'leftInset',
  'rightInset',
  'xDomain',
  'yDomain',
  'xTicks',
  'xFormatter',
  'showLegend',
  'connectDots',
  'trendLine',
  'tooltip',
  'ref',
] as const;
