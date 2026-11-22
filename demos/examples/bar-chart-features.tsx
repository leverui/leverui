import { type JSX } from '@solidjs/web';
import { BarChart, type BarDatum, type BarSeries } from '../../src';
import { barMonthlyData, monthlySales } from './bar-chart-data';

/** Signed page-view values from the green/red bar example. */
const pageViews: readonly BarDatum[] = [
  { name: 'Page A', views: 400 },
  { name: 'Page B', views: -300 },
  { name: 'Page C', views: -200 },
  { name: 'Page D', views: 278 },
  { name: 'Page E', views: -189 },
  { name: 'Page F', views: 239 },
  { name: 'Page G', views: 349 },
];

/** Print three-letter month names under the labeled and guided examples. */
function shortMonth(value: string): string {
  return value.slice(0, 3);
}

/** Color signed values and place their labels outside the bar ends. */
export function BarChartFillWithValue(): JSX.Element {
  return (
    <BarChart
      data={pageViews}
      xKey="name"
      series={[
        {
          name: 'views',
          color: 'teal.solid',
          colorBySign: { positive: 'green.solid', negative: 'red.solid' },
          radius: 4,
          label: {
            color: '#808080',
            weight: 500,
            positiveOffset: 10,
            negativeOffset: 18,
          },
        },
      ]}
      yDomain={[-400, 400]}
      showXAxis={false}
      showYAxis={false}
      topInset={30}
      bottomInset={0}
    />
  );
}

/** Put a numeric value above each of the grouped monthly bars. */
export function BarChartBarLabel(): JSX.Element {
  const series: readonly BarSeries[] = [
    { name: 'windows', color: 'teal.solid', label: true },
    { name: 'mac', color: 'purple.solid', label: true },
    { name: 'linux', color: 'blue.solid', label: true },
  ];
  return (
    <BarChart
      data={barMonthlyData.slice(0, 4)}
      xKey="month"
      series={series}
      xTickFormatter={shortMonth}
      showYAxis={false}
      yDomain={[0, 200]}
      yTickValues={[0, 50, 100, 150, 200]}
      showLegend
      tooltip
      maxHeight={448}
    />
  );
}

/** Shade the sales target band and mark its dashed reference line. */
export function BarChartReferenceLines(): JSX.Element {
  return (
    <BarChart
      data={monthlySales}
      xKey="month"
      series={[{ name: 'sales', color: 'blue.solid', fillOpacity: 0.64 }]}
      xTickFormatter={shortMonth}
      yDomain={[0, 100000]}
      showYAxis={false}
      tooltip
      referenceArea={{ from: 76000, to: 90000, label: 'top line', color: 'red.muted' }}
      referenceValue={{ value: 80000, color: 'red.fg' }}
    />
  );
}
