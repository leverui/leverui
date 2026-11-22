import { type JSX } from '@solidjs/web';
import { AreaChart } from '../../src';
import { dotData, monthlyData, monthlySeries, shortMonth, signedProducts } from './area-chart-data';

/** Show the three stacked monthly series. */
export function AreaChartBasic(): JSX.Element {
  return (
    <AreaChart
      data={monthlyData}
      series={monthlySeries}
      xKey="month"
      stacked
      showGrid
      showLegend
      xTickValues={['February', 'March', 'May', 'June', 'August', 'October', 'November']}
      xTickFormatter={shortMonth}
      aria-label="Monthly operating system counts"
    />
  );
}

/** Split a signed product series into positive and negative fill colors. */
export function AreaChartFillWithValue(): JSX.Element {
  return (
    <AreaChart
      data={signedProducts}
      series={[{ name: 'uv', color: 'teal.solid', stroke: 'gray.solid' }]}
      xKey="name"
      showYAxis
      gridDashed
      gridVertical
      yDomain={[-2000, 6000]}
      valueGradient
      curve="monotone"
      xTickFormatter={
        /** Shorten product labels to their final letter. */
        (value) => value.replace('Product ', '')
      }
      yTickFormatter={
        /** Match the compact dollar labels. */
        (value) =>
          Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 0,
          }).format(value)
      }
      aria-label="Product values above and below zero"
    />
  );
}

/** Normalize each monthly stack to a percentage of its total. */
export function AreaChartPercent(): JSX.Element {
  return (
    <AreaChart
      data={monthlyData}
      series={monthlySeries}
      xKey="month"
      stacked
      percent
      showGrid
      showYAxis
      showLegend
      xTickFormatter={shortMonth}
      aria-label="Monthly operating system percentages"
    />
  );
}

/** Label the category and value axes explicitly. */
export function AreaChartAxisLabel(): JSX.Element {
  return (
    <AreaChart
      data={monthlyData}
      series={monthlySeries}
      xKey="month"
      stacked
      showYAxis
      showGrid={false}
      xAxisLabel="Month"
      yAxisLabel="Count"
      xTickFormatter={shortMonth}
      aria-label="Monthly operating system counts with axis labels"
    />
  );
}

/** Make one stacked series dashed while preserving the remaining strokes. */
export function AreaChartDashedArea(): JSX.Element {
  const series = [
    { name: 'windows', color: 'teal.solid', strokeDasharray: '5 3', strokeWidth: 2 },
    { name: 'mac', color: 'orange.solid' },
    { name: 'linux', color: 'blue.solid' },
  ];
  return (
    <AreaChart
      data={monthlyData}
      series={series}
      xKey="month"
      stacked
      showGrid
      showLegend
      xTickFormatter={shortMonth}
      aria-label="Monthly operating system counts with a dashed area"
    />
  );
}

/** Add point markers over a monthly stack with two larger Linux samples. */
export function AreaChartDots(): JSX.Element {
  return (
    <AreaChart
      data={dotData}
      series={monthlySeries}
      xKey="month"
      stacked
      showGrid
      showYAxis
      showLegend
      showXAxis={false}
      dots
      aria-label="Monthly operating system counts with points"
    />
  );
}
