import { type JSX } from '@solidjs/web';
import { LineChart } from '../../src';
import type { CartesianDatum } from '../../src/charts/cartesian-types';
import { compactSales, restrictedSalesTicks, shortMonth } from './line-chart-data';

/** Monthly temperatures spanning several theme colors. */
const temperatureData: readonly CartesianDatum[] = [
  { temp: -20, month: 'January' },
  { temp: -10, month: 'February' },
  { temp: 0, month: 'March' },
  { temp: 10, month: 'May' },
  { temp: 20, month: 'June' },
  { temp: 4, month: 'August' },
  { temp: 40, month: 'October' },
  { temp: -10, month: 'November' },
];

/** Change stroke color across a naturally curved temperature line. */
export function LineChartGradient(): JSX.Element {
  return (
    <LineChart
      data={temperatureData}
      series={[
        {
          name: 'temp',
          color: 'teal.solid',
          strokeWidth: 4,
          dotFill: 'fg',
          dotStroke: 'bg',
          dotRadius: 2,
          activeDotRadius: 4,
          strokeGradientStops: [
            { offset: '0%', color: 'teal.solid' },
            { offset: '20%', color: 'purple.solid' },
            { offset: '40%', color: 'orange.solid' },
            { offset: '75%', color: 'green.solid' },
            { offset: '100%', color: 'red.solid' },
          ],
        },
      ]}
      xKey="month"
      showYAxis
      yDomain={[-20, 60]}
      curve="natural"
      dots
      xTickFormatter={shortMonth}
      aria-label="Monthly temperature with gradient line"
    />
  );
}

/** Highlight each sales sample with a larger outlined point. */
export function LineChartCustomDot(): JSX.Element {
  return (
    <LineChart
      data={compactSales}
      series={[
        {
          name: 'sales',
          color: 'teal.solid',
          strokeWidth: 4,
          dotRadius: 5,
          dotStroke: 'white',
          activeDotRadius: 6,
          activeDotStroke: 'teal.solid',
        },
      ]}
      xKey="month"
      showYAxis
      showGrid
      gridVertical
      gridDashed
      dots
      yDomain={[160, 205]}
      yTickValues={restrictedSalesTicks}
      xTickFormatter={shortMonth}
      aria-label="Sales line with custom points"
    />
  );
}

/** Named ultraviolet values beside each line point. */
const uvData: readonly CartesianDatum[] = [
  { name: 'Jan', uv: 400 },
  { name: 'Feb', uv: 300 },
  { name: 'Mar', uv: 200 },
  { name: 'Apr', uv: 278 },
  { name: 'May', uv: 189 },
  { name: 'Jun', uv: 239 },
  { name: 'Jul', uv: 349 },
];

/** Place bold values to the right of each line point. */
export function LineChartPointLabel(): JSX.Element {
  return (
    <LineChart
      data={uvData}
      series={[
        {
          name: 'uv',
          color: 'teal.solid',
          strokeWidth: 2,
          dotStroke: 'teal.solid',
          dotStrokeWidth: 2,
        },
      ]}
      xKey="name"
      maxHeight={448}
      plotMargin={{ left: 40, right: 40, top: 40 }}
      showGrid
      gridHorizontal={false}
      gridVertical
      gridDashed
      dots
      pointLabels
      pointLabelPosition="right"
      aria-label="Ultraviolet values labeled at each point"
    />
  );
}
