import { type JSX } from '@solidjs/web';
import { LineChart } from '../../src';
import type { CartesianDatum } from '../../src/charts/cartesian-types';
import { shortMonth } from './line-chart-data';

/** Compare the current year against the previous-year trend. */
const trendData: readonly CartesianDatum[] = [
  { thisYear: 10, lastYear: 4, month: 'January' },
  { thisYear: 95, lastYear: 50, month: 'February' },
  { thisYear: 87, lastYear: 59, month: 'March' },
  { thisYear: 88, lastYear: 60, month: 'May' },
  { thisYear: 65, lastYear: 50, month: 'June' },
  { thisYear: 90, lastYear: 50, month: 'August' },
  { thisYear: null, lastYear: 89, month: 'October' },
  { thisYear: null, lastYear: 120, month: 'November' },
  { thisYear: null, lastYear: 80, month: 'December' },
];

/** Mark the latest current-year sample and the horizontal target. */
export function LineChartReferencePoint(): JSX.Element {
  return (
    <LineChart
      data={trendData}
      series={[
        { name: 'thisYear', label: 'This year', color: 'teal.solid', strokeWidth: 2 },
        { name: 'lastYear', label: 'Last year', color: 'gray.emphasized', strokeWidth: 2 },
      ]}
      xKey="month"
      showYAxis
      showLegend
      legendReverse
      yDomain={[0, 120]}
      xTickFormatter={shortMonth}
      referenceValue={{ y: 110, label: 'Target', color: 'purple.fg', strokeDasharray: '5 5' }}
      referencePoint={{ x: 'August', y: 90, color: 'teal.solid', radius: 6 }}
      aria-label="Current and previous year values with target"
    />
  );
}
