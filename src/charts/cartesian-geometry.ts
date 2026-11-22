import type {
  CartesianCurve,
  CartesianDatum,
  CartesianPlot,
  CartesianPoint,
  CartesianSeries,
} from './cartesian-types';
import { chartCurvePath } from './cartesian-curves';
export { cartesianPlot } from './cartesian-plot';

/** Read a finite numeric series value without coercing category strings. */
export function chartNumber(row: CartesianDatum, key: string): number | null {
  const value = row[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

/** Find the visible domain for stacked or independent numeric series. */
export function chartDomain(
  data: readonly CartesianDatum[],
  series: readonly CartesianSeries[],
  stacked: boolean,
  percent: boolean,
): { min: number; max: number } {
  if (percent) return { min: 0, max: 1 };
  const values = data.flatMap(
    /** Read one row's maximum stack or all independent series values. */
    (row) =>
      stacked
        ? [
            series.reduce(
              /** Add one visible positive stack value. */
              (sum, item) => sum + Math.max(0, chartNumber(row, item.name) ?? 0),
              0,
            ),
          ]
        : series.flatMap(
            /** Omit missing or invalid samples from the scale. */
            (item) => chartNumber(row, item.name) ?? [],
          ),
  );
  const min = Math.min(0, ...values);
  const max = Math.max(0, ...values);
  if (min === max) return { min, max: min + 1 };
  const magnitude = 10 ** Math.floor(Math.log10((max - min) / 4));
  const rawStep = (max - min) / (4 * magnitude);
  const step =
    [1, 1.5, 2, 2.5, 5, 10].find(
      /** Choose the smallest readable interval above the raw step. */
      (candidate) => candidate >= rawStep,
    ) ?? 10;
  const rounded = step * magnitude;
  const roundedMin = Math.floor(min / rounded) * rounded;
  return {
    min: roundedMin,
    max: Math.max(Math.ceil(max / rounded) * rounded, roundedMin + 4 * rounded),
  };
}

/** Convert a numeric value to its vertical SVG coordinate. */
export function chartY(plot: CartesianPlot, value: number): number {
  const bottom = plot.height - plot.bottom;
  const range = bottom - plot.top;
  return bottom - ((value - plot.min) / (plot.max - plot.min)) * range;
}

/** Convert a row index to its horizontal SVG coordinate. */
export function chartX(plot: CartesianPlot, index: number, count: number): number {
  const start = plot.left + (plot.padLeft ?? 0);
  const end = plot.width - plot.right - (plot.padRight ?? 0);
  if (count < 2) return (start + end) / 2;
  return start + (index / (count - 1)) * (end - start);
}

/** Scale one series, including its cumulative baseline when stacked. */
export function chartSeriesPoints(
  data: readonly CartesianDatum[],
  series: readonly CartesianSeries[],
  seriesIndex: number,
  plot: CartesianPlot,
  stacked: boolean,
  percent: boolean,
): CartesianPoint[] {
  const current = series[seriesIndex];
  if (!current) return [];
  return data.map(
    /** Position one row within the series and stack. */
    (row, index) => {
      const value = chartNumber(row, current.name);
      const base = stacked
        ? series.slice(0, seriesIndex).reduce(
            /** Add prior visible series at this row. */
            (sum, item) => sum + Math.max(0, chartNumber(row, item.name) ?? 0),
            0,
          )
        : 0;
      const total = percent
        ? series.reduce(
            /** Sum the current row for a normalized stack. */
            (sum, item) => sum + Math.max(0, chartNumber(row, item.name) ?? 0),
            0,
          )
        : 1;
      const divisor = total || 1;
      return {
        index,
        value,
        x: chartX(plot, index, data.length),
        y: chartY(plot, (base + (value ?? 0)) / divisor),
        baseY: chartY(plot, base / divisor),
      };
    },
  );
}

/** Split missing samples into independently drawable path segments. */
export function chartSegments(
  points: readonly CartesianPoint[],
  connectNulls: boolean,
): CartesianPoint[][] {
  if (connectNulls) return [points.filter((point) => point.value !== null)];
  const segments: CartesianPoint[][] = [];
  for (const point of points) {
    if (point.value === null) continue;
    if (points[point.index - 1]?.value === null || segments.length === 0) segments.push([]);
    segments[segments.length - 1]?.push(point);
  }
  return segments;
}

/** Keep missing stacked area samples at the baseline when connecting their outline. */
export function chartStackedAreaSegments(points: readonly CartesianPoint[]): CartesianPoint[][] {
  const first = points.findIndex(
    /** Skip missing samples before the first value. */
    (point) => point.value !== null,
  );
  if (first < 0) return [];
  const trimmed = points.slice(first);
  while (trimmed.at(-1)?.value === null) trimmed.pop();
  return [
    trimmed.map(
      /** Turn an interior gap into a zero-height stack sample. */
      (point) => (point.value === null ? { ...point, value: 0 } : point),
    ),
  ];
}

/** Select the missing-sample policy for a line or stacked area. */
export function chartRenderableSegments(
  points: readonly CartesianPoint[],
  kind: 'area' | 'line',
  stacked: boolean,
  connectNulls: boolean,
): CartesianPoint[][] {
  return kind === 'area' && stacked && connectNulls
    ? chartStackedAreaSegments(points)
    : chartSegments(points, connectNulls);
}

/** Trace a series using the requested interpolation. */
export function chartLinePath(points: readonly CartesianPoint[], curve: CartesianCurve): string {
  return chartCurvePath(points, curve);
}

/** Close an area line against its per-point baseline. */
export function chartAreaPath(points: readonly CartesianPoint[], curve: CartesianCurve): string {
  const line = chartLinePath(points, curve);
  if (!line) return '';
  const baseline = [...points]
    .reverse()
    .map(
      /** Visit stacked baseline points in reverse order. */
      (point) => `L ${point.x} ${point.baseY}`,
    )
    .join(' ');
  return `${line} ${baseline} Z`;
}
