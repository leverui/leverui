import { radialPoint, radialSectorPath } from './radial-geometry';

/** Points where a rounded radial edge meets its straight side and circular arc. */
interface CornerPoints {
  side: { x: number; y: number };
  arc: { x: number; y: number };
}

/** Construct a corner circle tangent to a radial side and concentric arc. */
function cornerPoints(
  center: number,
  radius: number,
  corner: number,
  angle: number,
  side: number,
  outer: boolean,
): CornerPoints {
  const radians = (angle * Math.PI) / 180;
  const ux = Math.cos(radians);
  const uy = -Math.sin(radians);
  const tx = -Math.sin(radians);
  const ty = -Math.cos(radians);
  const distance = radius + (outer ? -corner : corner);
  const along = Math.sqrt(distance * distance - corner * corner);
  const circleX = ux * along + tx * side * corner;
  const circleY = uy * along + ty * side * corner;
  return {
    side: radialPoint(center, along, angle),
    arc: {
      x: center + (circleX * radius) / distance,
      y: center + (circleY * radius) / distance,
    },
  };
}

/** Draw a donut sector with four circular corners tangent to both ring edges. */
export function roundedRadialSectorPath(
  center: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
  requestedCorner: number,
): string {
  const span = Math.abs(endAngle - startAngle);
  if (span >= 360 || innerRadius <= 0)
    return radialSectorPath(center, innerRadius, outerRadius, startAngle, endAngle);
  const sine = Math.sin(Math.min(span / 2, 90) * (Math.PI / 180));
  const outerLimit = (outerRadius * sine) / (1 + sine);
  const innerLimit = sine < 1 ? (innerRadius * sine) / (1 - sine) : Infinity;
  const corner = Math.min(requestedCorner, (outerRadius - innerRadius) / 2, outerLimit, innerLimit);
  if (corner <= 0) return radialSectorPath(center, innerRadius, outerRadius, startAngle, endAngle);
  const direction = Math.sign(endAngle - startAngle);
  const sweep = direction > 0 ? 0 : 1;
  const outerStart = cornerPoints(center, outerRadius, corner, startAngle, direction, true);
  const outerEnd = cornerPoints(center, outerRadius, corner, endAngle, -direction, true);
  const innerStart = cornerPoints(center, innerRadius, corner, startAngle, direction, false);
  const innerEnd = cornerPoints(center, innerRadius, corner, endAngle, -direction, false);
  const outerAngle = (Math.asin(corner / (outerRadius - corner)) * 180) / Math.PI;
  const innerAngle = (Math.asin(corner / (innerRadius + corner)) * 180) / Math.PI;
  const outerLarge = span - 2 * outerAngle > 180 ? 1 : 0;
  const innerLarge = span - 2 * innerAngle > 180 ? 1 : 0;
  return [
    `M ${outerStart.side.x} ${outerStart.side.y}`,
    `A ${corner} ${corner} 0 0 ${sweep} ${outerStart.arc.x} ${outerStart.arc.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${outerLarge} ${sweep} ${outerEnd.arc.x} ${outerEnd.arc.y}`,
    `A ${corner} ${corner} 0 0 ${sweep} ${outerEnd.side.x} ${outerEnd.side.y}`,
    `L ${innerEnd.side.x} ${innerEnd.side.y}`,
    `A ${corner} ${corner} 0 0 ${sweep} ${innerEnd.arc.x} ${innerEnd.arc.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${innerLarge} ${1 - sweep} ${innerStart.arc.x} ${innerStart.arc.y}`,
    `A ${corner} ${corner} 0 0 ${sweep} ${innerStart.side.x} ${innerStart.side.y} Z`,
  ].join(' ');
}
