import { type JSX } from '@solidjs/web';
import { RadialChart } from '../../src';
import { languages, operatingSystems, threeSystems } from './radial-chart-data';

/** Show the four-sector operating-system distribution. */
export function PieChartBasic(): JSX.Element {
  return <RadialChart data={operatingSystems} aria-label="Operating systems" />;
}

/** Remove the separating stroke between pie sectors. */
export function PieChartNoStroke(): JSX.Element {
  return (
    <RadialChart data={operatingSystems} stroke="none" tooltip aria-label="Operating systems" />
  );
}

/** Show each value inside its pie sector. */
export function PieChartLabelInside(): JSX.Element {
  return (
    <RadialChart
      data={operatingSystems}
      size={320}
      label="inside"
      labelFormatter={
        /** Display the source value within each sector. */
        (datum) => String(datum.value)
      }
      tooltip
      aria-label="Operating systems with inside labels"
    />
  );
}

/** Display each name and percentage just outside its sector. */
export function PieChartLabelOutside(): JSX.Element {
  return (
    <RadialChart
      data={operatingSystems}
      outerRadius={100}
      label="outside"
      labelFormatter={
        /** Format the one-decimal percentage labels. */
        (datum, percent) => `${datum.name}: ${(percent * 100).toFixed(1)}%`
      }
      aria-label="Operating systems with percentages"
    />
  );
}

/** Add a swatch legend for the three named sectors. */
export function PieChartLegend(): JSX.Element {
  return <RadialChart data={threeSystems} legend aria-label="Operating systems with legend" />;
}

/** Place value labels at the ends of guide lines. */
export function PieChartPointLabel(): JSX.Element {
  return (
    <RadialChart
      data={operatingSystems}
      size={320}
      label="point"
      labelFormatter={
        /** Match the numeric point labels. */
        (datum) => String(datum.value)
      }
      tooltip
      aria-label="Operating systems with point labels"
    />
  );
}

/** Sweep the language distribution across the upper half of a circle. */
export function PieChartStartAngle(): JSX.Element {
  return (
    <RadialChart
      data={languages}
      size={320}
      startAngle={180}
      endAngle={0}
      tooltip
      aria-label="Programming languages"
    />
  );
}
