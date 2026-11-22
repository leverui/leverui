import { type JSX } from '@solidjs/web';
import { RadialBarChart, type RadialBarDatum } from '../../src';

/** The four monthly values and theme colors in the radial example. */
const radialData: readonly RadialBarDatum[] = [
  { name: 'January', value: 165, color: 'teal.solid' },
  { name: 'February', value: 190, color: 'purple.solid' },
  { name: 'March', value: 195, color: 'blue.solid' },
  { name: 'May', value: 182, color: 'teal.solid' },
];

/** Draw four concentric monthly value bars with background tracks. */
export function RadialChartBasic(): JSX.Element {
  return <RadialBarChart data={radialData} aria-label="Monthly radial values" />;
}

/** Label each value within the start of its radial ring. */
export function RadialChartLabel(): JSX.Element {
  return (
    <RadialBarChart
      data={radialData}
      label
      tooltip={false}
      aria-label="Labeled monthly radial values"
    />
  );
}

/** Fit a four-month legend below the radial value bars. */
export function RadialChartLegend(): JSX.Element {
  return (
    <RadialBarChart
      data={radialData}
      legend
      gap={4}
      aria-label="Monthly radial values with legend"
    />
  );
}
