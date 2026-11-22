import { type JSX } from '@solidjs/web';

/** A category row with numeric values and optional color metadata. */
export type BarDatum = Readonly<
  Record<string, string | number | readonly [number, number] | null | undefined>
>;

/** One colored measurement, optionally sharing a stack with other series. */
export interface BarSeries {
  name: string;
  color: string;
  stroke?: string;
  stackId?: string;
  colorKey?: string;
  colorBySign?: { positive: string; negative: string };
  colorByDirection?: { up: string; down: string };
  wickKey?: string;
  radius?: number;
  label?: boolean | BarLabelOptions;
  fillOpacity?: number;
}

/** Appearance and placement of a bar's numeric value label. */
export interface BarLabelOptions {
  color?: string;
  weight?: 500 | 600;
  positiveOffset?: number;
  negativeOffset?: number;
}

/** Public options for a responsive category bar chart. */
export interface BarChartProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'children' | 'data' | 'height'
> {
  data: readonly BarDatum[];
  xKey: string;
  series: readonly BarSeries[];
  height?: number;
  maxHeight?: number;
  orientation?: 'vertical' | 'horizontal';
  topInset?: number;
  bottomInset?: number;
  leftInset?: number;
  rightInset?: number;
  yDomain?: readonly [number, number];
  yTickValues?: readonly number[];
  yTickFormatter?: (value: number) => string;
  xTickFormatter?: (value: string) => string;
  xTickEvery?: number;
  xTickRenderer?: (row: BarDatum, index: number, x: number, y: number) => JSX.Element;
  xAxisLabel?: string;
  yAxisLabel?: string;
  tooltipLabelFormatter?: (row: BarDatum) => string;
  showYAxis?: boolean;
  yAxisPlacement?: 'left' | 'right';
  showXAxis?: boolean;
  showGrid?: boolean;
  verticalGrid?: boolean;
  gridDashed?: boolean;
  showAxisLines?: boolean;
  showLegend?: boolean;
  legendPlacement?: 'bottom' | 'top-right';
  tooltip?: boolean;
  barSize?: number;
  categoryGap?: number;
  barGap?: number;
  percent?: boolean;
  referenceArea?: { from: number; to: number; label?: string; color?: string };
  referenceValue?: { value: number; color?: string };
  className?: string;
  unstyled?: boolean;
}
