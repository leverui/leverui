/** One point in a small SVG chart. */
export interface SparklinePoint {
  x: number;
  y: number;
}

/** Scale a numeric series into a padded SVG viewport. */
export function sparklinePoints(
  values: readonly number[],
  width: number,
  height: number,
  inset = 5,
): SparklinePoint[] {
  if (values.length === 0) return [];
  if (!Number.isFinite(inset) || inset < 0 || width <= inset * 2 || height <= inset * 2) {
    throw new Error('Sparkline inset must leave room for the chart.');
  }
  const maximum = Math.max(1, ...values) * 1.05;
  const horizontal = width - inset * 2;
  const vertical = height - inset * 2;
  return values.map(
    /** Place each value at an even horizontal interval. */
    (value, index) => ({
      x:
        inset + (values.length === 1 ? horizontal / 2 : (horizontal * index) / (values.length - 1)),
      y: inset + vertical * (1 - Math.max(0, value) / maximum),
    }),
  );
}

/** Position one eight-pixel bar in an evenly spaced category band. */
export function sparklineBarX(width: number, count: number, index: number): number {
  return 7 + ((width - 10) * index) / count;
}

/** Connect chart points with straight SVG segments. */
export function sparklineLinePath(points: readonly SparklinePoint[]): string {
  return points
    .map(
      /** Prefix the first point with move and later points with line. */
      (point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`,
    )
    .join(' ');
}

/** Smooth chart points using neighboring slopes. */
export function sparklineSmoothPath(points: readonly SparklinePoint[]): string {
  const first = points[0];
  if (!first) return '';
  let path = `M ${first.x} ${first.y}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    if (!previous || !current) continue;
    const before = points[index - 2] ?? previous;
    const after = points[index + 1] ?? current;
    const span = current.x - previous.x;
    path += ` C ${previous.x + span / 3} ${previous.y + (current.y - before.y) / 6}`;
    path += ` ${current.x - span / 3} ${current.y - (after.y - previous.y) / 6}`;
    path += ` ${current.x} ${current.y}`;
  }
  return path;
}

/** Close a line path against the chart's lower edge. */
export function sparklineAreaPath(
  line: string,
  points: readonly SparklinePoint[],
  height: number,
  inset = 5,
): string {
  const first = points[0];
  const last = points[points.length - 1];
  if (!first || !last) return '';
  return `${line} L ${last.x} ${height - inset} L ${first.x} ${height - inset} Z`;
}
