import type { RadialDatum } from '../../src';

/** Operating-system distribution shared by the pie and donut charts. */
export const operatingSystems: readonly RadialDatum[] = [
  { name: 'windows', value: 400, color: 'blue.solid' },
  { name: 'mac', value: 300, color: 'orange.solid' },
  { name: 'linux', value: 300, color: 'pink.solid' },
  { name: 'other', value: 200, color: 'green.solid' },
];

/** Three-item distribution used by legend and segment-gap examples. */
export const threeSystems: readonly RadialDatum[] = [
  { name: 'windows', value: 400, color: 'teal.solid' },
  { name: 'mac', value: 300, color: 'orange.solid' },
  { name: 'linux', value: 300, color: 'blue.solid' },
];

/** Three-color distribution used by the padded donut. */
export const paddedSystems: readonly RadialDatum[] = [
  { name: 'windows', value: 400, color: 'blue.solid' },
  { name: 'mac', value: 300, color: 'orange.solid' },
  { name: 'linux', value: 300, color: 'pink.solid' },
];

/** Programming-language distribution used by the half-circle example. */
export const languages: readonly RadialDatum[] = [
  { name: 'typescript', value: 400, color: 'blue.solid' },
  { name: 'javascript', value: 120, color: 'orange.solid' },
  { name: 'python', value: 300, color: 'pink.solid' },
  { name: 'rust', value: 278, color: 'purple.solid' },
];

/** Browser values before grouping small slices into Other. */
export const browserValues: readonly RadialDatum[] = [
  { name: 'windows', value: 400, color: 'blue.solid' },
  { name: 'mac', value: 300, color: 'orange.solid' },
  { name: 'linux', value: 150, color: 'pink.solid' },
  { name: 'chrome', value: 80, color: 'purple.solid' },
  { name: 'firefox', value: 60, color: 'red.solid' },
  { name: 'safari', value: 40, color: 'yellow.solid' },
  { name: 'edge', value: 30, color: 'cyan.solid' },
  { name: 'opera', value: 20, color: 'teal.solid' },
];

/** Combine sub-threshold browser values without changing source rows. */
export function groupSmallSlices(data: readonly RadialDatum[], threshold: number): RadialDatum[] {
  const large = data.filter(
    /** Preserve values at or above the threshold. */
    (item) => item.value >= threshold,
  );
  const other = data.reduce(
    /** Sum values below the threshold. */
    (sum, item) => sum + (item.value < threshold ? item.value : 0),
    0,
  );
  return other > 0 ? [...large, { name: 'Other', value: other, color: 'gray.emphasized' }] : large;
}
