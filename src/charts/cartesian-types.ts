import { type JSX } from '@solidjs/web';

/** A chart row with a category and dynamic numeric series keys. */
export type CartesianDatum = Readonly<Record<string, string | number | null | undefined>>;

/** One named numeric series and its theme color. */
export interface CartesianSeries {
  name: string;
  label?: string;
  color: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDasharray?: string;
  strokeGradientStops?: readonly { offset: string; color: string }[];
  dotRadius?: number;
  dotFill?: string;
  dotStroke?: string;
  dotStrokeWidth?: number;
  activeDotRadius?: number;
  activeDotStroke?: string;
  yAxis?: 'left' | 'right';
}

/** Supported line interpolations for area and line series. */
export type CartesianCurve =
  'linear' | 'step' | 'stepBefore' | 'stepAfter' | 'natural' | 'monotone' | 'basis' | 'bump';

/** Labeled vertical guide at one category. */
export interface CartesianReferenceLine {
  x: string;
  label?: string;
  color?: string;
}

/** Highlight a contiguous interval between two categories. */
export interface CartesianReferenceArea {
  x1: string;
  x2: string;
  label?: string;
  color?: string;
}

/** Optional SVG plot insets, in pixels, for chart-specific geometry. */
export interface CartesianPlotMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

/** Public chart options shared by the area and line renderers. */
export interface CartesianChartProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  data: readonly CartesianDatum[];
  series: readonly CartesianSeries[];
  xKey: string;
  kind?: 'area' | 'line';
  height?: number;
  maxHeight?: number;
  plotMargin?: CartesianPlotMargin;
  stacked?: boolean;
  percent?: boolean;
  fillOpacity?: number;
  gradient?: boolean;
  valueGradient?: boolean;
  curve?: CartesianCurve;
  dots?: boolean;
  pointLabels?: boolean;
  pointLabelPosition?: 'top' | 'right';
  connectNulls?: boolean;
  showGrid?: boolean;
  gridHorizontal?: boolean;
  gridDashed?: boolean;
  gridVertical?: boolean;
  showYAxis?: boolean;
  showLegend?: boolean;
  legendPlacement?: 'bottom' | 'top-right';
  legendReverse?: boolean;
  legendInteraction?: 'hover';
  tooltip?: boolean;
  tooltipContent?: (row: CartesianDatum, series: readonly CartesianSeries[]) => JSX.Element;
  showXAxis?: boolean;
  /** Rotate the category labels by this many degrees, such as `-45`. */
  xTickAngle?: number;
  /** Inset the first and last categories from the plot edges, in pixels. */
  xPadding?: { left?: number; right?: number };
  /** Draw the axis lines and tick marks. */
  showAxisLines?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  rightYAxisLabel?: string;
  rightYDomain?: readonly [number, number];
  xTickValues?: readonly string[];
  xTickFormatter?: (value: string) => string;
  yTickFormatter?: (value: number) => string;
  yTickValues?: readonly number[];
  yDomain?: readonly [number, number];
  referenceLines?: readonly CartesianReferenceLine[];
  referenceArea?: CartesianReferenceArea;
  referenceValue?: { y: number; label?: string; color?: string; strokeDasharray?: string };
  referencePoint?: { x: string; y: number; color?: string; radius?: number };
  'aria-label'?: string | false;
}

/** Plot boundaries and numeric domain for SVG rendering. */
export interface CartesianPlot {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  min: number;
  max: number;
  /** Pixels between the plot's left edge and the first category. */
  padLeft?: number;
  /** Pixels between the last category and the plot's right edge. */
  padRight?: number;
}

/** One scaled series sample with its stack baseline. */
export interface CartesianPoint {
  index: number;
  value: number | null;
  x: number;
  y: number;
  baseY: number;
}
