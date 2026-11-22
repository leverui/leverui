import { type JSX } from '@solidjs/web';
import { RadialChart } from '../../src';
import {
  browserValues,
  groupSmallSlices,
  operatingSystems,
  paddedSystems,
} from './radial-chart-data';

/** Show four values as a narrow donut ring. */
export function DonutChartBasic(): JSX.Element {
  return (
    <RadialChart
      data={operatingSystems}
      innerRadius={80}
      outerRadius={100}
      tooltip
      aria-label="Operating systems"
    />
  );
}

/** Place value labels outside the ring with guide lines. */
export function DonutChartPointLabel(): JSX.Element {
  return (
    <RadialChart
      data={operatingSystems}
      innerRadius={80}
      outerRadius={100}
      label="point"
      plotOffsetX={20}
      labelFormatter={
        /** Print each sector's source value. */
        (datum) => String(datum.value)
      }
      tooltip
      aria-label="Operating systems with point labels"
    />
  );
}

/** Place the total and its unit at the center of the ring. */
export function DonutChartCenteredText(): JSX.Element {
  return (
    <RadialChart
      data={operatingSystems}
      innerRadius={80}
      outerRadius={100}
      centerTitle="1,200"
      centerDescription="users"
      tooltip
      aria-label="Operating systems, 1,200 users"
    />
  );
}

/** Separate three rounded-looking ring segments by eight degrees. */
export function DonutChartAnglePadding(): JSX.Element {
  return (
    <RadialChart
      data={paddedSystems}
      innerRadius={80}
      outerRadius={100}
      paddingAngle={8}
      cornerRadius={4}
      tooltip
      aria-label="Operating systems with gaps"
    />
  );
}

/** Draw a half-circle donut with a thicker ring. */
export function DonutChartStartAndEndAngle(): JSX.Element {
  return (
    <RadialChart
      data={operatingSystems}
      innerRadius={60}
      outerRadius={100}
      startAngle={180}
      endAngle={0}
      tooltip
      aria-label="Operating systems in a half circle"
    />
  );
}

/** Expand a sector outward when it receives focus or hover. */
export function DonutChartDetachedSegment(): JSX.Element {
  return (
    <RadialChart
      data={operatingSystems}
      innerRadius={60}
      outerRadius={100}
      strokeWidth={5}
      detached
      tooltip
      aria-label="Operating systems with detachable sectors"
    />
  );
}

/** Combine browser values below 100 into one labeled Other sector. */
export function DonutChartOtherLabel(): JSX.Element {
  const data = groupSmallSlices(browserValues, 100);
  return (
    <RadialChart
      data={data}
      size={384}
      innerRadius={60}
      outerRadius={100}
      label="outside"
      labelFormatter={
        /** Include each grouped sector's share of the whole. */
        (datum, percent) => `${datum.name} (${(percent * 100).toFixed(1)}%)`
      }
      tooltip
      aria-label="Browsers with small values grouped"
    />
  );
}
