import type { RadarDatum } from './radar-geometry';
import { type JSX } from '@solidjs/web';

/** A color-coded measurement drawn over the shared polar grid. */
export interface RadarSeries {
  name: string;
  color: string;
}

/** Public options for a theme-aware polar radar chart. */
export interface RadarChartProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'children' | 'data' | 'ref'
> {
  data: readonly RadarDatum[];
  series: readonly RadarSeries[];
  width?: number;
  height?: number;
  maxValue?: number;
  grid?: 'polygon' | 'circle' | 'filled';
  angleLabels?: boolean;
  radiusLabels?: boolean;
  legend?: boolean;
  linesOnly?: boolean;
  dots?: boolean;
  pointLabels?: boolean;
  tooltip?: boolean;
  'aria-label'?: string | false;
  className?: string;
  ref?: ((element: HTMLDivElement) => void) | undefined;
}
