import { type JSX } from '@solidjs/web';
import { CartesianChart, type CartesianChartProps } from './cartesian-chart';

/** Public options for a responsive Lever UI line chart. */
export type LineChartProps = Omit<
  CartesianChartProps,
  'kind' | 'stacked' | 'percent' | 'fillOpacity' | 'gradient' | 'valueGradient' | 'referenceArea'
>;

/** Draw numeric series as lines using the shared Cartesian chart primitives. */
export function LineChart(props: LineChartProps): JSX.Element {
  return <CartesianChart {...props} kind="line" />;
}
