/** A data row with finite numeric coordinates and optional group metadata. */
export interface ScatterDatum {
  readonly [key: string]: string | number;
}

/** Rectangular plotting bounds expressed in SVG coordinates. */
export interface ScatterPlot {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

/** Compute a readable positive vertical domain for the visible samples. */
export function scatterMaximum(data: readonly ScatterDatum[], yKey: string): number {
  const greatest = data.reduce(
    /** Ignore metadata and invalid measurements while finding the maximum. */
    (maximum, row) => {
      const value = row[yKey];
      return typeof value === 'number' && Number.isFinite(value)
        ? Math.max(maximum, value)
        : maximum;
    },
    0,
  );
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(1, greatest / 4)));
  const step = Math.ceil(greatest / 4 / magnitude) * magnitude;
  return Math.max(4, step * 4);
}

/** Determine horizontal bounds from finite numeric values only. */
export function scatterXDomain(data: readonly ScatterDatum[], xKey: string): [number, number] {
  const values = data.flatMap(
    /** Select one valid x coordinate without coercing strings. */
    (row) => {
      const value = row[xKey];
      return typeof value === 'number' && Number.isFinite(value) ? [value] : [];
    },
  );
  if (values.length === 0) return [0, 1];
  const low = values.reduce(
    /** Keep the smallest visible horizontal measurement. */
    (minimum, value) => Math.min(minimum, value),
    Number.POSITIVE_INFINITY,
  );
  const high = values.reduce(
    /** Keep the largest visible horizontal measurement. */
    (maximum, value) => Math.max(maximum, value),
    Number.NEGATIVE_INFINITY,
  );
  return low === high ? [low - 1, high + 1] : [low, high];
}

/** Map a numeric x measurement into the plot's horizontal span. */
export function scatterX(plot: ScatterPlot, value: number): number {
  return (
    plot.left +
    ((value - plot.xMin) / (plot.xMax - plot.xMin)) * (plot.width - plot.left - plot.right)
  );
}

/** Map a numeric y measurement into the plot's upward SVG axis. */
export function scatterY(plot: ScatterPlot, value: number): number {
  return (
    plot.height -
    plot.bottom -
    ((value - plot.yMin) / (plot.yMax - plot.yMin)) * (plot.height - plot.top - plot.bottom)
  );
}

/** Fit the least-squares trend through valid chart coordinates. */
export function scatterTrend(
  data: readonly ScatterDatum[],
  xKey: string,
  yKey: string,
): readonly [{ x: number; y: number }, { x: number; y: number }] | null {
  const points = data.flatMap(
    /** Exclude rows with missing or nonnumeric coordinates. */
    (row) => {
      const x = row[xKey];
      const y = row[yKey];
      return typeof x === 'number' &&
        Number.isFinite(x) &&
        typeof y === 'number' &&
        Number.isFinite(y)
        ? [{ x, y }]
        : [];
    },
  );
  if (points.length < 2) return null;
  const meanX =
    points.reduce(
      /** Sum the valid horizontal coordinates for their mean. */
      (sum, point) => sum + point.x,
      0,
    ) / points.length;
  const meanY =
    points.reduce(
      /** Sum the valid vertical coordinates for their mean. */
      (sum, point) => sum + point.y,
      0,
    ) / points.length;
  const numerator = points.reduce(
    /** Sum the covariance numerator for the least-squares slope. */
    (sum, point) => sum + (point.x - meanX) * (point.y - meanY),
    0,
  );
  const denominator = points.reduce(
    /** Sum horizontal variance and detect a vertical-only sample set. */
    (sum, point) => sum + (point.x - meanX) ** 2,
    0,
  );
  if (denominator === 0) return null;
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;
  const first = points.reduce(
    /** Find the first endpoint's smallest x coordinate. */
    (minimum, point) => Math.min(minimum, point.x),
    Number.POSITIVE_INFINITY,
  );
  const last = points.reduce(
    /** Find the second endpoint's largest x coordinate. */
    (maximum, point) => Math.max(maximum, point.x),
    Number.NEGATIVE_INFINITY,
  );
  return [
    { x: first, y: slope * first + intercept },
    { x: last, y: slope * last + intercept },
  ];
}
