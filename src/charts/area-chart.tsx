import { type JSX } from '@solidjs/web';
import { CartesianChart } from './cartesian-chart';
import type { CartesianChartProps } from './cartesian-types';

/** Public props for a responsive leverui area chart. */
export type AreaChartProps = Omit<CartesianChartProps, 'kind'>;

/** Render filled Cartesian series with optional stacking and guide layers. */
export function AreaChart(props: AreaChartProps): JSX.Element {
  return <CartesianChart {...props} kind="area" />;
}
