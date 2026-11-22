import { sparklineSmoothPath, type SparklinePoint } from './sparkline-geometry';
import type { CartesianCurve } from './cartesian-types';

/** Draw a smooth S-shaped transition between horizontal plateaus. */
function bumpPath(points: readonly SparklinePoint[]): string {
  const first = points[0];
  if (!first) return '';
  let path = `M ${first.x} ${first.y}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const point = points[index];
    if (!previous || !point) continue;
    const middle = (previous.x + point.x) / 2;
    path += ` C ${middle} ${previous.y} ${middle} ${point.y} ${point.x} ${point.y}`;
  }
  return path;
}

/** Smooth through segment midpoints for a basis-like interpolation. */
function basisPath(points: readonly SparklinePoint[]): string {
  const first = points[0];
  if (!first) return '';
  let path = `M ${first.x} ${first.y}`;
  for (let index = 1; index < points.length - 1; index += 1) {
    const point = points[index];
    const next = points[index + 1];
    if (!point || !next) continue;
    path += ` Q ${point.x} ${point.y} ${(point.x + next.x) / 2} ${(point.y + next.y) / 2}`;
  }
  const last = points[points.length - 1];
  if (last && last !== first) path += ` L ${last.x} ${last.y}`;
  return path;
}

/** Calculate a shape-preserving slope at one sample. */
function monotoneSlope(points: readonly SparklinePoint[], index: number): number {
  const current = points[index];
  const previous = points[index - 1];
  const next = points[index + 1];
  if (!current) return 0;
  if (!previous && next) return (next.y - current.y) / (next.x - current.x);
  if (!next && previous) return (current.y - previous.y) / (current.x - previous.x);
  if (!previous || !next) return 0;
  const before = (current.y - previous.y) / (current.x - previous.x);
  const after = (next.y - current.y) / (next.x - current.x);
  if (before * after <= 0) return 0;
  return (2 * before * after) / (before + after);
}

/** Join samples with cubic controls that preserve local extrema. */
function monotonePath(points: readonly SparklinePoint[]): string {
  const first = points[0];
  if (!first) return '';
  let path = `M ${first.x} ${first.y}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const point = points[index];
    if (!previous || !point) continue;
    const step = (point.x - previous.x) / 3;
    path += ` C ${previous.x + step} ${previous.y + monotoneSlope(points, index - 1) * step}`;
    path += ` ${point.x - step} ${point.y - monotoneSlope(points, index) * step}`;
    path += ` ${point.x} ${point.y}`;
  }
  return path;
}

/** Trace an SVG path with the selected interpolation policy. */
export function chartCurvePath(points: readonly SparklinePoint[], curve: CartesianCurve): string {
  const first = points[0];
  if (!first) return '';
  if (curve === 'natural') return sparklineSmoothPath(points);
  if (curve === 'monotone') return monotonePath(points);
  if (curve === 'basis') return basisPath(points);
  if (curve === 'bump') return bumpPath(points);
  let path = `M ${first.x} ${first.y}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const point = points[index];
    if (!previous || !point) continue;
    if (curve === 'step') {
      const middle = (previous.x + point.x) / 2;
      path += ` H ${middle} V ${point.y} H ${point.x}`;
    } else if (curve === 'stepBefore') {
      path += ` V ${point.y} H ${point.x}`;
    } else if (curve === 'stepAfter') {
      path += ` H ${point.x} V ${point.y}`;
    } else {
      path += ` L ${point.x} ${point.y}`;
    }
  }
  return path;
}
