import { type JSX } from '@solidjs/web';
import { LineChart } from '../../src';
import {
  compactSales,
  dashedData,
  restrictedSalesTicks,
  salesTicks,
  shortMonth,
  sparseSales,
} from './line-chart-data';

/** Dash the Windows line and vertical grid while leaving Mac solid. */
export function LineChartDashed(): JSX.Element {
  return (
    <LineChart
      data={dashedData}
      series={[
        { name: 'windows', color: 'teal.solid', strokeWidth: 2, strokeDasharray: '5 5' },
        { name: 'mac', color: 'purple.solid', strokeWidth: 2 },
      ]}
      xKey="month"
      showYAxis
      showGrid
      gridVertical
      gridDashed
      dots
      yDomain={[140, 195]}
      yTickValues={salesTicks}
      xTickFormatter={shortMonth}
      aria-label="Dashed Windows and solid Mac lines"
    />
  );
}

/** Connect the sales samples on either side of missing months. */
export function LineChartNulls(): JSX.Element {
  return (
    <LineChart
      data={sparseSales}
      series={[{ name: 'sales', color: 'teal.solid', strokeWidth: 2 }]}
      xKey="month"
      showYAxis
      gridVertical
      gridDashed
      showGrid
      dots
      connectNulls
      yDomain={[140, 195]}
      yTickValues={salesTicks}
      xTickFormatter={shortMonth}
      aria-label="Connected sales line with missing months"
    />
  );
}

/** Emphasize a smoothed line using the four-pixel stroke. */
export function LineChartStrokeWidth(): JSX.Element {
  return (
    <LineChart
      data={compactSales}
      series={[{ name: 'sales', color: 'teal.solid', strokeWidth: 4 }]}
      xKey="month"
      showYAxis
      gridVertical
      gridDashed
      showGrid
      dots
      curve="natural"
      yDomain={[140, 195]}
      yTickValues={salesTicks}
      xTickFormatter={shortMonth}
      aria-label="Sales with a wider line stroke"
    />
  );
}

/** Crop the value scale to make close sales values easier to inspect. */
export function LineChartValueDomain(): JSX.Element {
  return (
    <LineChart
      data={compactSales}
      series={[{ name: 'sales', color: 'teal.solid', strokeWidth: 4 }]}
      xKey="month"
      showYAxis
      gridVertical
      gridDashed
      showGrid
      dots
      curve="natural"
      yDomain={[160, 205]}
      yTickValues={restrictedSalesTicks}
      xTickFormatter={shortMonth}
      aria-label="Sales with a restricted value axis"
    />
  );
}
