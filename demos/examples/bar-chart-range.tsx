import { type JSX } from '@solidjs/web';
import { BarChart, type BarDatum } from '../../src';

/** Country intervals from the floating range chart. */
const countryRanges: readonly BarDatum[] = [
  { name: 'UK', value: [10, 20] },
  { name: 'US', value: [15, 25] },
  { name: 'EU', value: [5, 18] },
  { name: 'JP', value: [12, 30] },
];

/** Draw floating bars between each country's lower and upper bounds. */
export function BarChartRange(): JSX.Element {
  return (
    <BarChart
      data={countryRanges}
      xKey="name"
      series={[{ name: 'value', color: 'teal.solid' }]}
      yDomain={[0, 35]}
      yTickValues={[0, 9, 18, 27, 35]}
      barSize={100}
      gridDashed
      topInset={20}
      leftInset={80}
      rightInset={30}
    />
  );
}
