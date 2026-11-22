/** A labeled category with numeric values for one or more radar series. */
export interface RadarDatum {
  label: string;
  readonly [series: string]: string | number;
}

/** A point in the radar chart's SVG coordinate system. */
export interface RadarPoint {
  x: number;
  y: number;
}

/** Position a category on the radial axis, starting at twelve o'clock. */
export function radarPoint(
  centerX: number,
  centerY: number,
  radius: number,
  index: number,
  count: number,
): RadarPoint {
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / count;
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
}

/** Join a ring of points into a closed SVG path. */
export function radarPath(points: readonly RadarPoint[]): string {
  if (points.length < 3) return '';
  return `${points
    .map(
      /** Serialize one polygon vertex without rounding its scaled position. */
      (point, index) => `${index === 0 ? 'M' : 'L'}${point.x} ${point.y}`,
    )
    .join(' ')} Z`;
}

/** Round the largest finite measurement to a readable axis maximum. */
export function radarMaximum(data: readonly RadarDatum[], names: readonly string[]): number {
  const largest = data.reduce(
    /** Find the greatest positive value across every visible series. */
    (maximum, datum) =>
      names.reduce(
        /** Ignore strings and invalid numbers at the chart boundary. */
        (current, name) => {
          const value = datum[name];
          return typeof value === 'number' && Number.isFinite(value)
            ? Math.max(current, value)
            : current;
        },
        maximum,
      ),
    0,
  );
  return Math.max(20, Math.ceil(largest / 20) * 20);
}

/** Scale a series to the selected polar domain without changing input data. */
export function radarSeriesPoints(
  data: readonly RadarDatum[],
  name: string,
  centerX: number,
  centerY: number,
  radius: number,
  maximum: number,
): RadarPoint[] {
  return data.map(
    /** Convert each valid value into a point on its category spoke. */
    (datum, index) => {
      const value = datum[name];
      const fraction =
        typeof value === 'number' && Number.isFinite(value)
          ? Math.max(0, Math.min(1, value / maximum))
          : 0;
      return radarPoint(centerX, centerY, radius * fraction, index, data.length);
    },
  );
}
