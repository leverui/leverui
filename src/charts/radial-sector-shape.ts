import { radialSectorPath, type RadialSector } from './radial-geometry';
import { roundedRadialSectorPath } from './radial-rounded-geometry';

/** Resolve one sector path, including active expansion and optional corners. */
export function radialSectorShape(
  sector: RadialSector,
  center: number,
  innerRadius: number,
  outerRadius: number,
  cornerRadius: number,
  detached: boolean,
): string {
  const activeRadius = detached ? outerRadius + 20 : outerRadius;
  if (cornerRadius > 0) {
    return roundedRadialSectorPath(
      center,
      innerRadius,
      activeRadius,
      sector.startAngle,
      sector.endAngle,
      cornerRadius,
    );
  }
  return detached
    ? radialSectorPath(center, innerRadius, activeRadius, sector.startAngle, sector.endAngle)
    : sector.path;
}
