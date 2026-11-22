import { type JSX } from '@solidjs/web';
import type { RadialDatum } from './radial-geometry';
import type { ChartRootStyle } from './chart-root-style';

/** Label placement supported by the standalone radial chart. */
export type RadialLabel = 'inside' | 'outside' | 'point';

/** Public options for a leverui-owned pie or donut chart. */
export interface RadialChartProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'children' | 'ref' | 'size' | 'style'
> {
  data: readonly RadialDatum[];
  size?: number | undefined;
  outerRadius?: number | undefined;
  plotOffsetX?: number | undefined;
  innerRadius?: number | undefined;
  startAngle?: number | undefined;
  endAngle?: number | undefined;
  paddingAngle?: number | undefined;
  cornerRadius?: number | undefined;
  stroke?: string | undefined;
  strokeWidth?: number | undefined;
  label?: RadialLabel | undefined;
  labelFormatter?: ((datum: RadialDatum, percent: number) => string) | undefined;
  legend?: boolean | undefined;
  centerTitle?: string | undefined;
  centerDescription?: string | undefined;
  tooltip?: boolean | undefined;
  detached?: boolean | undefined;
  className?: string | undefined;
  style?: ChartRootStyle | undefined;
  ref?: ((element: HTMLDivElement) => void) | undefined;
}
