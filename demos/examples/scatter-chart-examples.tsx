import { type JSX } from '@solidjs/web';
import { ScatterChart } from '../../src';
import {
  groupOne,
  groupTwo,
  groupedSeries,
  temperatureData,
  temperatureSeries,
} from './scatter-chart-data';

/** Format the basic temperature axis in degrees Celsius. */
function celsius(value: number): string {
  return `${value}°C`;
}

/** Plot twelve temperature measurements over the sales axis. */
export function ScatterChartBasic(): JSX.Element {
  return (
    <ScatterChart
      data={temperatureData}
      xKey="temperature"
      yKey="sales"
      series={temperatureSeries}
      xDomain={[10, 28.1]}
      yDomain={[0, 800]}
      xTicks={[10, 15, 20, 25, 28.1]}
      xFormatter={celsius}
    />
  );
}

/** Label the blue coordinate group beneath its scatter plot. */
export function ScatterChartLegend(): JSX.Element {
  return (
    <ScatterChart
      data={groupOne}
      xKey="x"
      yKey="y"
      series={[{ name: 'Group 1', color: 'blue.solid' }]}
      xDomain={[0, 180]}
      yDomain={[0, 400]}
      topInset={20}
      leftInset={60}
      rightInset={30}
      showLegend
    />
  );
}

/** Separate two labeled clusters and enable point tooltips. */
export function ScatterChartMultiple(): JSX.Element {
  return (
    <ScatterChart
      data={[...groupOne, ...groupTwo]}
      xKey="x"
      yKey="y"
      series={groupedSeries}
      xDomain={[90, 250]}
      yDomain={[0, 400]}
      topInset={20}
      leftInset={60}
      rightInset={30}
      tooltip
    />
  );
}

/** Connect the six source-ordered teal points with gray segments. */
export function ScatterChartConnectDots(): JSX.Element {
  return (
    <ScatterChart
      data={[
        { x: 40, y: 200 },
        { x: 120, y: 100 },
        { x: 170, y: 300 },
        { x: 140, y: 250 },
        { x: 150, y: 400 },
        { x: 110, y: 280 },
      ]}
      xKey="x"
      yKey="y"
      series={[{ name: 'Group 1', color: 'teal.solid' }]}
      xDomain={[0, 180]}
      yDomain={[0, 400]}
      topInset={20}
      leftInset={60}
      rightInset={30}
      connectDots
    />
  );
}

/** Add the least-squares red line to the temperature scatter plot. */
export function ScatterChartTrendLine(): JSX.Element {
  return (
    <ScatterChart
      data={temperatureData}
      xKey="temperature"
      yKey="sales"
      series={temperatureSeries}
      xDomain={[10, 28.1]}
      yDomain={[0, 800]}
      xTicks={[10, 15, 20, 25, 28.1]}
      topInset={20}
      leftInset={60}
      rightInset={30}
      trendLine
    />
  );
}
