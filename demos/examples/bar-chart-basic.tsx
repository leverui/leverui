import { type JSX } from '@solidjs/web';
import { BarChart } from '../../src';
import { allocationData, coloredAllocation } from './bar-chart-data';

/** Format allocation values as percentages on the numeric axis. */
function allocationTick(value: number): string {
  return `${value}%`;
}

/** Draw the four wide teal allocation bars in the basic example. */
export function BarChartBasic(): JSX.Element {
  return (
    <BarChart
      data={allocationData}
      xKey="type"
      series={[{ name: 'allocation', color: 'teal.solid' }]}
      yDomain={[0, 100]}
      yTickFormatter={allocationTick}
    />
  );
}

/** Color each allocation bar from its own data row. */
export function BarChartBarColor(): JSX.Element {
  return (
    <BarChart
      data={coloredAllocation}
      xKey="type"
      series={[{ name: 'allocation', color: 'teal.solid', colorKey: 'color' }]}
      yDomain={[0, 100]}
      yTickFormatter={allocationTick}
    />
  );
}

/** Use forty-pixel bars with ten-pixel upper corners. */
export function BarChartRounded(): JSX.Element {
  return (
    <BarChart
      data={allocationData}
      xKey="type"
      series={[{ name: 'allocation', color: 'teal.solid', radius: 10 }]}
      yDomain={[0, 100]}
      yTickFormatter={allocationTick}
      barSize={40}
    />
  );
}
