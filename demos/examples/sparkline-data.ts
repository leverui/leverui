import type { SparklineData } from '../../src';

/** Eight values shared by the area and line examples. */
export const sparklineValues: SparklineData[] = [
  { value: 10 },
  { value: 16 },
  { value: 19 },
  { value: 15 },
  { value: 12 },
  { value: 15 },
  { value: 10 },
  { value: 18 },
];

/** Alternating bar colors. */
export const sparklineBars: SparklineData[] = [
  { value: 10, fill: 'teal.solid' },
  { value: 16, fill: 'green.solid' },
  { value: 19, fill: 'teal.solid' },
  { value: 15, fill: 'green.solid' },
  { value: 12, fill: 'teal.solid' },
  { value: 15, fill: 'teal.solid' },
  { value: 10, fill: 'teal.solid' },
  { value: 18, fill: 'teal.solid' },
];

/** Weekly download counts for the interactive example. */
export const weeklyDownloads: SparklineData[] = [
  { value: 125000 },
  { value: 158000 },
  { value: 189000 },
  { value: 210000 },
  { value: 105000 },
  { value: 278000 },
  { value: 310000 },
  { value: 345000 },
];

/** Monthly closing prices for the stock card. */
export const stockPrices: SparklineData[] = [
  { value: 145.43 },
  { value: 151.73 },
  { value: 157.65 },
  { value: 169.68 },
  { value: 173.75 },
  { value: 186.68 },
  { value: 181.99 },
  { value: 189.46 },
];
