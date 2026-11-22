/** One named value rendered as a radial chart sector. */
export interface RadialDatum {
  name: string;
  value: number;
  color: string;
}

/** Geometry and source data for one radial chart sector. */
export interface RadialSector {
  datum: RadialDatum;
  index: number;
  startAngle: number;
  endAngle: number;
  midAngle: number;
  path: string;
}

/** Convert a polar chart position to SVG coordinates. */
export function radialPoint(
  center: number,
  radius: number,
  angle: number,
): { x: number; y: number } {
  const radians = (angle * Math.PI) / 180;
  return {
    x: center + radius * Math.cos(radians),
    y: center - radius * Math.sin(radians),
  };
}

/** Draw a ring sector, or a filled wedge when the inner radius is zero. */
export function radialSectorPath(
  center: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const outerStart = radialPoint(center, outerRadius, startAngle);
  const outerEnd = radialPoint(center, outerRadius, endAngle);
  const innerEnd = radialPoint(center, innerRadius, endAngle);
  const innerStart = radialPoint(center, innerRadius, startAngle);
  const span = Math.abs(endAngle - startAngle);
  if (span >= 360) {
    const midpoint = (startAngle + endAngle) / 2;
    const first = radialSectorPath(center, innerRadius, outerRadius, startAngle, midpoint);
    const second = radialSectorPath(center, innerRadius, outerRadius, midpoint, endAngle);
    return `${first} ${second}`;
  }
  const largeArc = span > 180 ? 1 : 0;
  const sweep = endAngle > startAngle ? 0 : 1;
  const outer = `M ${outerStart.x} ${outerStart.y} A ${outerRadius} ${outerRadius} 0 ${largeArc} ${sweep} ${outerEnd.x} ${outerEnd.y}`;
  if (innerRadius <= 0) return `${outer} L ${center} ${center} Z`;
  return `${outer} L ${innerEnd.x} ${innerEnd.y} A ${innerRadius} ${innerRadius} 0 ${largeArc} ${1 - sweep} ${innerStart.x} ${innerStart.y} Z`;
}

/** Allocate a chart's angular span without mutating the caller's data. */
export function radialSectors(
  data: readonly RadialDatum[],
  center: number,
  innerRadius: number,
  outerRadius: number,
  startAngle = 0,
  endAngle = 360,
  paddingAngle = 0,
): RadialSector[] {
  const positive = data
    .map(
      /** Preserve each source index even when rows share one object reference. */
      (datum, index) => ({ datum, index }),
    )
    .filter(
      /** Only positive values can occupy an angular sector. */
      ({ datum }) => Number.isFinite(datum.value) && datum.value > 0,
    );
  const total = positive.reduce(
    /** Accumulate the visible sector values. */
    (sum, item) => sum + item.datum.value,
    0,
  );
  if (total <= 0) return [];
  const direction = Math.sign(endAngle - startAngle);
  const available = Math.max(0, Math.abs(endAngle - startAngle) - paddingAngle * positive.length);
  let cursor = startAngle;
  return positive.map(
    /** Place one sector within the remaining angular span. */
    ({ datum, index }) => {
      const from = cursor;
      const to = from + (direction * available * datum.value) / total;
      cursor = to + direction * paddingAngle;
      return {
        datum,
        index,
        startAngle: from,
        endAngle: to,
        midAngle: (from + to) / 2,
        path: radialSectorPath(center, innerRadius, outerRadius, from, to),
      };
    },
  );
}
