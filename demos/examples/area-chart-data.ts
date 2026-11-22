import type { CartesianDatum, CartesianSeries } from '../../src/charts/cartesian-chart';

/** Monthly operating-system counts shared by the area examples. */
export const monthlyData: readonly CartesianDatum[] = [
  { windows: 186, mac: 80, linux: 120, month: 'January' },
  { windows: 165, mac: 95, linux: 110, month: 'February' },
  { windows: 190, mac: 87, linux: 125, month: 'March' },
  { windows: 195, mac: 88, linux: 130, month: 'May' },
  { windows: 182, mac: 98, linux: 122, month: 'June' },
  { windows: 175, mac: 90, linux: 115, month: 'August' },
  { windows: 180, mac: 86, linux: 124, month: 'October' },
  { windows: 185, mac: 91, linux: 126, month: 'November' },
];

/** Theme colors for the three operating-system series. */
export const monthlySeries: readonly CartesianSeries[] = [
  { name: 'windows', color: 'teal.solid' },
  { name: 'mac', color: 'purple.solid' },
  { name: 'linux', color: 'blue.solid' },
];

/** Monthly data with a larger late-year Linux count for dot examples. */
export const dotData: readonly CartesianDatum[] = monthlyData.map(
  /** Replace two plotted values while preserving the other source months. */
  (row, index) => ({ ...row, linux: index === 5 ? 349 : index === 6 ? 400 : row.linux }),
);

/** Sparse sales values used to compare connected and disconnected nulls. */
export const sparseSales: readonly CartesianDatum[] = [
  { sales: 186, month: 'January' },
  { sales: null, month: 'February' },
  { sales: 190, month: 'March' },
  { sales: 195, month: 'May' },
  { sales: null, month: 'June' },
  { sales: 175, month: 'August' },
  { sales: 180, month: 'October' },
  { sales: 185, month: 'November' },
  { sales: 300, month: 'December' },
];

/** Recharts omits the first tick in the nine-month sales examples. */
export const salesMonthTicks = [
  'February',
  'March',
  'May',
  'June',
  'August',
  'October',
  'November',
  'December',
] as const;

/** Sales values used by the point-label example. */
export const labeledSales: readonly CartesianDatum[] = [
  { sales: 186, month: 'January' },
  { sales: 40, month: 'February' },
  { sales: 190, month: 'March' },
  { sales: 195, month: 'May' },
  { sales: 240, month: 'June' },
  { sales: 175, month: 'August' },
  { sales: 180, month: 'October' },
  { sales: 185, month: 'November' },
  { sales: 300, month: 'December' },
];

/** Product values crossing zero in the signed-fill example. */
export const signedProducts: readonly CartesianDatum[] = [
  { name: 'Product A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Product B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Product C', uv: -1000, pv: 9800, amt: 2290 },
  { name: 'Product D', uv: 500, pv: 3908, amt: 2000 },
  { name: 'Product E', uv: -2000, pv: 4800, amt: 2181 },
  { name: 'Product F', uv: -250, pv: 3800, amt: 2500 },
  { name: 'Product G', uv: 3490, pv: 4300, amt: 2100 },
];

/** Trim a full month name to the three-character tick. */
export function shortMonth(value: string): string {
  return value.slice(0, 3);
}
