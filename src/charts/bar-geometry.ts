import type { CartesianPlot } from './cartesian-types';
import { chartY } from './cartesian-geometry';
import type { BarChartProps, BarDatum, BarSeries } from './bar-chart-types';

/** A visible SVG rectangle for one category and series. */
export interface BarRect {
  row: BarDatum;
  series: BarSeries;
  rowIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
}

/** Read a finite signed numeric measurement from a category row. */
export function barValue(row: BarDatum, name: string): number {
  const value = row[name];
  if (Array.isArray(value)) return barRange(value)?.[1] ?? 0;
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

/** Accept a two-ended interval only when both endpoints are finite. */
export function barRange(value: unknown): readonly [number, number] | null {
  if (!Array.isArray(value) || value.length !== 2) return null;
  const [start, end]: unknown[] = value;
  return typeof start === 'number' &&
    Number.isFinite(start) &&
    typeof end === 'number' &&
    Number.isFinite(end)
    ? [start, end]
    : null;
}

/** Give a stacked series one shared slot and independent series their own. */
export function barSlot(series: BarSeries): string {
  return series.stackId === undefined ? `series:${series.name}` : `stack:${series.stackId}`;
}

/** Find the highest independent value or cumulative stack. */
export function barMaximum(data: readonly BarDatum[], series: readonly BarSeries[]): number {
  const greatest = data.reduce(
    /** Compare every stack total for one category. */
    (maximum, row) => {
      const totals = new Map<string, number>();
      for (const item of series) {
        const slot = barSlot(item);
        totals.set(slot, (totals.get(slot) ?? 0) + Math.max(0, barValue(row, item.name)));
      }
      for (const total of totals.values()) maximum = Math.max(maximum, total);
      return maximum;
    },
    0,
  );
  return Math.max(1, greatest);
}

/** Accumulate earlier members of the same stack on the current value's side of zero. */
function priorStackValue(row: BarDatum, series: readonly BarSeries[], index: number): number {
  const current = series[index];
  if (!current) return 0;
  const value = barValue(row, current.name);
  return series.slice(0, index).reduce(
    /** Keep positive and negative stack branches independent. */
    (sum, item) => {
      const earlier = barValue(row, item.name);
      const sameSign = value < 0 ? earlier < 0 : earlier >= 0;
      return sum + (barSlot(item) === barSlot(current) && sameSign ? earlier : 0);
    },
    0,
  );
}

/** Compute a bar's band position and cumulative value interval. */
export function barRect(
  props: BarChartProps,
  plot: CartesianPlot,
  rowIndex: number,
  seriesIndex: number,
): BarRect | null {
  if (props.orientation === 'horizontal') {
    return horizontalBarRect(props, plot, rowIndex, seriesIndex);
  }
  const row = props.data[rowIndex];
  const series = props.series[seriesIndex];
  if (!row || !series || props.data.length === 0) return null;
  const slots = [
    ...new Set(
      props.series.map(
        /** Keep one horizontal slot for each independent series or stack. */
        barSlot,
      ),
    ),
  ];
  const slot = slots.indexOf(barSlot(series));
  const band = (plot.width - plot.left - plot.right) / props.data.length;
  const categoryGap = props.categoryGap ?? 0.2;
  const available = band * (1 - categoryGap);
  const barGap = props.barGap ?? 4;
  const slotWidth = (available - Math.max(0, slots.length - 1) * barGap) / slots.length;
  const width = Math.max(0, Math.min(props.barSize ?? slotWidth, slotWidth));
  const x =
    plot.left +
    band * rowIndex +
    (band - available) / 2 +
    slot * (slotWidth + barGap) +
    (slotWidth - width) / 2;
  const earlier = priorStackValue(row, props.series, seriesIndex);
  const value = barValue(row, series.name);
  const range = barRange(row[series.name]);
  const total = props.percent
    ? props.series.reduce(
        /** Normalize the shared stack to one hundred percent. */
        (sum, item) => sum + (barSlot(item) === barSlot(series) ? barValue(row, item.name) : 0),
        0,
      )
    : 1;
  const base = range ? range[0] : props.percent ? (total > 0 ? earlier / total : 0) : earlier;
  const scaled = range
    ? range[1] - range[0]
    : props.percent
      ? total > 0
        ? value / total
        : 0
      : value;
  const start = chartY(plot, base);
  const end = chartY(plot, base + scaled);
  return {
    row,
    series,
    rowIndex,
    x,
    y: Math.min(start, end),
    width,
    height: Math.abs(end - start),
    value,
  };
}

/** Place one horizontal series segment within its category's row band. */
function horizontalBarRect(
  props: BarChartProps,
  plot: CartesianPlot,
  rowIndex: number,
  seriesIndex: number,
): BarRect | null {
  const row = props.data[rowIndex];
  const series = props.series[seriesIndex];
  if (!row || !series || props.data.length === 0) return null;
  const slots = [...new Set(props.series.map(barSlot))];
  const slot = slots.indexOf(barSlot(series));
  const band = (plot.height - plot.top - plot.bottom) / props.data.length;
  const available = band * (1 - (props.categoryGap ?? 0.2));
  const slotHeight = (available - (slots.length - 1) * (props.barGap ?? 4)) / slots.length;
  const height = Math.max(0, Math.min(props.barSize ?? slotHeight, slotHeight));
  const y =
    plot.top +
    band * rowIndex +
    (band - available) / 2 +
    slot * (slotHeight + (props.barGap ?? 4)) +
    (slotHeight - height) / 2;
  const earlier = priorStackValue(row, props.series, seriesIndex);
  const value = barValue(row, series.name);
  const scale = (plot.width - plot.left - plot.right) / (plot.max - plot.min);
  const start = plot.left + (earlier - plot.min) * scale;
  const end = plot.left + (earlier + value - plot.min) * scale;
  return {
    row,
    series,
    rowIndex,
    x: Math.min(start, end),
    y,
    width: Math.abs(end - start),
    height,
    value,
  };
}

/** Form a bar path with the same radius on all four corners. */
export function barPath(rect: BarRect, radius: number): string {
  const rounding = Math.max(0, Math.min(radius, rect.width / 2, rect.height / 2));
  const bottom = rect.y + rect.height;
  const right = rect.x + rect.width;
  return `M${rect.x + rounding} ${rect.y} H${right - rounding} Q${right} ${rect.y} ${right} ${rect.y + rounding} V${bottom - rounding} Q${right} ${bottom} ${right - rounding} ${bottom} H${rect.x + rounding} Q${rect.x} ${bottom} ${rect.x} ${bottom - rounding} V${rect.y + rounding} Q${rect.x} ${rect.y} ${rect.x + rounding} ${rect.y} Z`;
}
