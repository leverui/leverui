import { type JSX } from '@solidjs/web';
import { BarChart, type BarDatum } from '../../src';
import { stackedSeries } from './bar-chart-data';

/** Five monthly operating-system samples from the horizontal example. */
const horizontalData: readonly BarDatum[] = [
  { windows: 186, mac: 80, linux: 120, month: 'January' },
  { windows: 165, mac: 95, linux: 110, month: 'February' },
  { windows: 190, mac: 87, linux: 125, month: 'March' },
  { windows: 180, mac: 86, linux: 124, month: 'October' },
  { windows: 185, mac: 91, linux: 126, month: 'November' },
];

/** Keep the three-letter month labels beside each bar. */
function shortMonth(value: string): string {
  return value.slice(0, 3);
}

/** Stack the three operating-system series across horizontal category rows. */
export function BarChartHorizontal(): JSX.Element {
  return (
    <BarChart
      data={horizontalData}
      xKey="month"
      series={stackedSeries}
      orientation="horizontal"
      xTickFormatter={shortMonth}
      yDomain={[0, 600]}
      barSize={30}
      categoryGap={0}
      maxHeight={448}
      showLegend
      tooltip
    />
  );
}
