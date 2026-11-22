import { radialSectorPath } from './radial-geometry';

/** One named numeric value in a concentric radial bar chart. */
export interface RadialBarDatum {
  name: string;
  value: number;
  color: string;
}

/** Precalculated paths and radius for one displayed ring. */
export interface RadialBarEntry {
  datum: RadialBarDatum;
  index: number;
  radius: number;
  background: string;
  foreground: string;
}

/** Trace a nearly complete clockwise ring so text follows its start edge. */
export function radialBarLabelPath(center: number, radius: number): string {
  const start = (5 * Math.PI) / 180;
  const end = (4 * Math.PI) / 180;
  const startX = center + radius * Math.sin(start);
  const startY = center - radius * Math.cos(start);
  const endX = center + radius * Math.sin(end);
  const endY = center - radius * Math.cos(end);
  return `M${startX},${startY} A${radius},${radius},0,1,1,${endX},${endY}`;
}

/** Scale independent values into concentric clockwise radial bars. */
export function radialBarEntries(
  data: readonly RadialBarDatum[],
  center: number,
  innerRadius: number,
  barSize: number,
  gap: number,
  maxValue?: number,
): RadialBarEntry[] {
  const maximum =
    maxValue ??
    data.reduce(
      /** Find the largest finite value without copying or spreading source rows. */
      (max, item) => (Number.isFinite(item.value) ? Math.max(max, item.value) : max),
      0,
    );
  if (!Number.isFinite(maximum) || maximum <= 0) return [];
  return data.flatMap(
    /** Keep valid source values at their original ring indices. */
    (datum, index) => {
      if (!Number.isFinite(datum.value) || datum.value < 0) return [];
      const inner = innerRadius + index * (barSize + gap);
      const outer = inner + barSize;
      const end = 90 - (360 * Math.min(datum.value, maximum)) / maximum;
      return [
        {
          datum,
          index,
          radius: inner + barSize / 2,
          background: radialSectorPath(center, inner, outer, 90, -270),
          foreground: radialSectorPath(center, inner, outer, 90, end),
        },
      ];
    },
  );
}
