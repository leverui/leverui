import type { BarDatum, BarSeries } from '../../src';
import { monthlyData } from './area-chart-data';

/** Four allocation categories in the basic chart. */
export const allocationData: readonly BarDatum[] = [
  { allocation: 60, type: 'Stock' },
  { allocation: 45, type: 'Crypto' },
  { allocation: 12, type: 'ETF' },
  { allocation: 4, type: 'Cash' },
];

/** Per-category colors from the bar-color example. */
export const coloredAllocation: readonly BarDatum[] = [
  { allocation: 60, type: 'Stock', color: 'red.solid' },
  { allocation: 45, type: 'Crypto', color: 'blue.solid' },
  { allocation: 12, type: 'ETF', color: 'green.solid' },
  { allocation: 4, type: 'Cash', color: 'yellow.solid' },
];

/** The four quality measures across mobile, marketing, social, and commerce. */
export const qualityData: readonly BarDatum[] = [
  { type: 'mobile', poor: 40, fair: 100, good: 200, excellent: 70 },
  { type: 'marketing', poor: 15, fair: 40, good: 120, excellent: 90 },
  { type: 'social', poor: 70, fair: 135, good: 220, excellent: 180 },
  { type: 'ecommerce', poor: 175, fair: 155, good: 75, excellent: 95 },
];

/** The blue, orange, yellow, and green quality series. */
export const qualitySeries: readonly BarSeries[] = [
  { name: 'poor', color: 'blue.solid' },
  { name: 'fair', color: 'orange.solid' },
  { name: 'good', color: 'yellow.solid' },
  { name: 'excellent', color: 'green.solid' },
];

/** Reuse the eight monthly operating-system samples. */
export const barMonthlyData: readonly BarDatum[] = monthlyData;

/** The three monthly operating-system colors and one shared stack. */
export const stackedSeries: readonly BarSeries[] = [
  { name: 'windows', color: 'teal.solid', stackId: 'a' },
  { name: 'mac', color: 'purple.solid', stackId: 'a' },
  { name: 'linux', color: 'blue.solid', stackId: 'a' },
];

/** Two slots with Mac and Linux sharing the second one. */
export const mixedStackSeries: readonly BarSeries[] = [
  { name: 'windows', color: 'teal.solid', stackId: 'a' },
  { name: 'mac', color: 'purple.solid', stackId: 'b' },
  { name: 'linux', color: 'blue.solid', stackId: 'b' },
];

/** Seven monthly sales values used for compact currency and no-gap bars. */
export const monthlySales: readonly BarDatum[] = [
  { sales: 63000, month: 'June' },
  { sales: 72000, month: 'July' },
  { sales: 85000, month: 'August' },
  { sales: 79000, month: 'September' },
  { sales: 90000, month: 'October' },
  { sales: 95000, month: 'November' },
  { sales: 88000, month: 'December' },
];

/** Two request metrics in the right-side legend example. */
export const endpointData: readonly BarDatum[] = [
  { category: 'Web server', value: 200, maxValue: 450 },
  { category: 'Credit card', value: 700, maxValue: 900 },
  { category: 'Payment', value: 439, maxValue: 500 },
  { category: 'API', value: 147, maxValue: 200 },
  { category: 'Add to cart', value: 84, maxValue: 100 },
];
