import { type JSX } from '@solidjs/web';
import { LineChart } from '../../src';
import {
  customerData,
  monthlyData,
  multipleData,
  multipleDomain,
  multipleSeries,
  operatingSeries,
  revenueData,
  saleData,
  saleSeries,
  shortMonth,
} from './line-chart-data';

/** Draw the single teal sales line. */
export function LineChartBasic(): JSX.Element {
  return (
    <LineChart
      data={saleData}
      series={saleSeries}
      xKey="month"
      showYAxis
      xTickFormatter={shortMonth}
      aria-label="Monthly sales"
    />
  );
}

/** Label both axes around the same single-series plot. */
export function LineChartAxesLabel(): JSX.Element {
  return (
    <LineChart
      data={customerData}
      series={[{ name: 'Customers', color: 'teal.solid', strokeWidth: 2 }]}
      xKey="month"
      showYAxis
      xAxisLabel="Month"
      yAxisLabel="Customers"
      xTickFormatter={shortMonth}
      aria-label="Monthly sales with axis labels"
    />
  );
}

/** Plot Mac and Linux as independent lines with a legend. */
export function LineChartMultiple(): JSX.Element {
  return (
    <LineChart
      data={multipleData}
      series={multipleSeries}
      xKey="month"
      showYAxis
      showLegend
      legendReverse
      yDomain={multipleDomain}
      dots
      xTickFormatter={shortMonth}
      aria-label="Monthly Mac and Linux counts"
    />
  );
}

/** Omit point markers from the three operating-system lines. */
export function LineChartNoDots(): JSX.Element {
  return (
    <LineChart
      data={monthlyData}
      series={operatingSeries}
      xKey="month"
      showYAxis
      showLegend
      legendPlacement="top-right"
      legendReverse
      maxHeight={384}
      xTickFormatter={shortMonth}
      aria-label="Monthly operating system counts without points"
    />
  );
}

/** Show only the first and last category ticks with a descriptive axis label. */
export function LineChartStartEndTick(): JSX.Element {
  return (
    <LineChart
      data={saleData}
      series={saleSeries}
      xKey="month"
      showYAxis
      tooltip={false}
      curve="natural"
      xTickValues={['January', 'August']}
      xTickFormatter={shortMonth}
      xAxisLabel="Sales, January to August"
      aria-label="Sales from January through August"
    />
  );
}

/** Format the numeric axis as compact US-dollar revenue. */
export function LineChartValueFormatter(): JSX.Element {
  return (
    <LineChart
      data={revenueData}
      series={[{ name: 'revenue', color: 'teal.solid', strokeWidth: 2 }]}
      xKey="month"
      showYAxis
      xTickFormatter={shortMonth}
      yTickFormatter={
        /** Match the compact currency scale. */
        (value) =>
          Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 0,
          }).format(value)
      }
      aria-label="Monthly revenue in US dollars"
    />
  );
}
