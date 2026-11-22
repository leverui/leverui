import { type JSX } from '@solidjs/web';
import { BarChart } from '../../src';
import { barMonthlyData, mixedStackSeries, stackedSeries } from './bar-chart-data';

/** Shorten month labels without changing their source values. */
function shortMonth(value: string): string {
  return value.slice(0, 3);
}

/** Stack Windows, Mac, and Linux values in each monthly band. */
export function BarChartStacked(): JSX.Element {
  return (
    <BarChart
      data={barMonthlyData}
      xKey="month"
      series={stackedSeries}
      xTickFormatter={shortMonth}
      yDomain={[0, 600]}
      showYAxis={false}
      showLegend
      tooltip
    />
  );
}

/** Keep Windows beside a stacked Mac and Linux pair. */
export function BarChartStackedMix(): JSX.Element {
  return (
    <BarChart
      data={barMonthlyData}
      xKey="month"
      series={mixedStackSeries}
      xTickFormatter={shortMonth}
      showYAxis={false}
      showLegend
      tooltip
      maxHeight={448}
    />
  );
}

/** Normalize the stacked monthly totals to one hundred percent. */
export function BarChartPercent(): JSX.Element {
  return (
    <BarChart
      data={barMonthlyData}
      xKey="month"
      series={stackedSeries}
      xTickFormatter={shortMonth}
      yDomain={[0, 1]}
      percent
      showLegend
      tooltip
      maxHeight={448}
    />
  );
}
