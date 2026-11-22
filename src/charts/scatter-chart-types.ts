import type { ScatterDatum } from './scatter-geometry';
import { type JSX } from '@solidjs/web';

/** One color-coded data group within a scatter chart. */
export interface ScatterSeries {
  name: string;
  color: string;
  groupId?: string;
}

/** Public options for plotting numeric x/y measurements. */
export interface ScatterChartProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'children' | 'data' | 'ref'
> {
  data: readonly ScatterDatum[];
  xKey: string;
  yKey: string;
  series: readonly ScatterSeries[];
  height?: number;
  topInset?: number;
  leftInset?: number;
  rightInset?: number;
  xDomain?: readonly [number, number];
  yDomain?: readonly [number, number];
  xTicks?: readonly number[];
  xFormatter?: (value: number) => string;
  showLegend?: boolean;
  connectDots?: boolean;
  trendLine?: boolean;
  tooltip?: boolean;
  'aria-label'?: string | false;
  className?: string;
  ref?: ((element: HTMLDivElement) => void) | undefined;
}
