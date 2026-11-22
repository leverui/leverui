import { type JSX } from '@solidjs/web';
import type { ChartRootStyle } from './chart-root-style';
import type { RadialBarDatum } from './radial-bar-geometry';

/** Public options and native root attributes for a concentric value chart. */
export interface RadialBarChartProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'children' | 'ref' | 'size' | 'style'
> {
  data: readonly RadialBarDatum[];
  size?: number;
  innerRadius?: number;
  barSize?: number;
  gap?: number;
  maxValue?: number;
  label?: boolean;
  legend?: boolean;
  tooltip?: boolean;
  className?: string;
  style?: ChartRootStyle;
  ref?: ((element: HTMLDivElement) => void) | undefined;
}
