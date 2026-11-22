import { type JSX } from '@solidjs/web';
import { LineChart } from '../../src';
import type { CartesianDatum } from '../../src/charts/cartesian-types';
import { shortMonth } from './line-chart-data';

/** Windows and Mac values with separate ranges for the two value axes. */
const operatingData: readonly CartesianDatum[] = [
  { windows: 186, mac: 20, month: 'January' },
  { windows: 165, mac: 45, month: 'February' },
  { windows: 190, mac: 37, month: 'March' },
  { windows: 195, mac: 28, month: 'May' },
  { windows: 182, mac: 48, month: 'June' },
  { windows: 175, mac: 30, month: 'August' },
  { windows: 180, mac: 26, month: 'October' },
  { windows: 185, mac: 41, month: 'November' },
];

/** Plot Windows on the left scale and Mac on the right scale. */
export function LineChartBiaxial(): JSX.Element {
  return (
    <LineChart
      data={operatingData}
      series={[
        { name: 'windows', color: 'teal.solid', strokeWidth: 2, yAxis: 'left' },
        { name: 'mac', color: 'purple.solid', strokeWidth: 2, yAxis: 'right' },
      ]}
      xKey="month"
      showYAxis
      showLegend
      legendPlacement="top-right"
      legendReverse
      maxHeight={384}
      dots
      xAxisLabel="Month"
      yAxisLabel="Windows"
      rightYAxisLabel="Mac"
      xTickFormatter={shortMonth}
      aria-label="Windows and Mac values on separate axes"
    />
  );
}
