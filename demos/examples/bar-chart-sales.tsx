import { type JSX } from '@solidjs/web';
import { BarChart } from '../../src';
import { monthlySales } from './bar-chart-data';

/** Shorten monthly category labels to three letters. */
function shortMonth(value: string): string {
  return value.slice(0, 3);
}

/** Format sales values in compact US-dollar notation. */
function currencyTick(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 0,
  }).format(value);
}

/** Display compact-currency numeric ticks beside monthly sales. */
export function BarChartFormatter(): JSX.Element {
  return (
    <BarChart
      data={monthlySales}
      xKey="month"
      series={[{ name: 'sales', color: 'teal.solid' }]}
      xTickFormatter={shortMonth}
      yTickFormatter={currencyTick}
      yDomain={[0, 100000]}
      tooltip
    />
  );
}

/** Remove the empty category band gap between adjacent bars. */
export function BarChartNoGap(): JSX.Element {
  return (
    <BarChart
      data={monthlySales}
      xKey="month"
      series={[{ name: 'sales', color: 'teal.solid', stroke: 'var(--lui-colors-bg)' }]}
      xTickFormatter={shortMonth}
      categoryGap={0}
      yDomain={[0, 100000]}
      showYAxis={false}
      maxHeight={448}
      tooltip
    />
  );
}
