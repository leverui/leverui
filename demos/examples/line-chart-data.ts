import type { CartesianDatum, CartesianSeries } from '../../src/charts/cartesian-types';
import { monthlyData, shortMonth } from './area-chart-data';

/** Reuse the eight monthly operating-system samples. */
export { monthlyData, shortMonth };

/** Single-series sales values for the basic and axis examples. */
export const saleData: readonly CartesianDatum[] = [
  { sale: 10, month: 'January' },
  { sale: 95, month: 'February' },
  { sale: 87, month: 'March' },
  { sale: 88, month: 'May' },
  { sale: 65, month: 'June' },
  { sale: 90, month: 'August' },
];

/** One teal sales line with the two-pixel stroke. */
export const saleSeries: readonly CartesianSeries[] = [
  { name: 'sale', color: 'teal.solid', strokeWidth: 2 },
];

/** Customer counts in the labeled-axis example. */
export const customerData: readonly CartesianDatum[] = saleData.map(
  /** Rename the measured value while preserving the original month. */
  (row) => ({ Customers: row.sale, month: row.month }),
);

/** Two independent series for the multiple-line example. */
export const multipleData: readonly CartesianDatum[] = [
  { mac: 10, linux: 120, month: 'January' },
  { mac: 95, linux: 110, month: 'February' },
  { mac: 87, linux: 125, month: 'March' },
  { mac: 88, linux: 30, month: 'May' },
  { mac: 98, linux: 122, month: 'June' },
  { mac: 90, linux: 15, month: 'August' },
];

/** Purple and blue legend entries for the multiple-line example. */
export const multipleSeries: readonly CartesianSeries[] = [
  { name: 'mac', color: 'purple.solid', strokeWidth: 2 },
  { name: 'linux', color: 'blue.solid', strokeWidth: 2 },
];

/** Match the numeric scale for the two-series examples. */
export const multipleDomain = [0, 140] as const;

/** Match the uneven sales-axis ticks. */
export const salesTicks = [140, 155, 170, 185, 195] as const;

/** Match the four ticks in the restricted sales domain. */
export const restrictedSalesTicks = [160, 175, 190, 205] as const;

/** Monthly operating-system series with the line weights. */
export const operatingSeries: readonly CartesianSeries[] = [
  { name: 'windows', color: 'teal.solid', strokeWidth: 2 },
  { name: 'mac', color: 'purple.solid', strokeWidth: 2 },
  { name: 'linux', color: 'blue.solid', strokeWidth: 2 },
];

/** Compact US-dollar revenue values for the formatter example. */
export const revenueData: readonly CartesianDatum[] = [
  { revenue: 10000, month: 'January' },
  { revenue: 95000, month: 'February' },
  { revenue: 87000, month: 'March' },
  { revenue: 88000, month: 'May' },
  { revenue: 65000, month: 'June' },
  { revenue: 90000, month: 'August' },
];

/** Sparse sales samples used by the connected-null line. */
export const sparseSales: readonly CartesianDatum[] = [
  { sales: 186, month: 'January' },
  { sales: null, month: 'February' },
  { sales: 190, month: 'March' },
  { sales: 195, month: 'May' },
  { sales: null, month: 'June' },
  { sales: 175, month: 'August' },
  { sales: 180, month: 'October' },
];

/** Five sales samples for stroke and domain comparisons. */
export const compactSales: readonly CartesianDatum[] = [
  { sales: 186, month: 'January' },
  { sales: 190, month: 'March' },
  { sales: 195, month: 'May' },
  { sales: 175, month: 'August' },
  { sales: 180, month: 'October' },
];

/** Two nearby OS series for dashed-line comparisons. */
export const dashedData: readonly CartesianDatum[] = monthlyData.map(
  /** Match the Mac values without changing the shared data. */
  (row, index) => ({
    windows: row.windows,
    mac: [165, 155, 175, 180, 170, 160, 165, 170][index],
    month: row.month,
  }),
);
