import { type JSX } from '@solidjs/web';
import { BarChart, type BarDatum } from '../../src';
import { endpointData, qualityData, qualitySeries } from './bar-chart-data';
import './bar-chart-groups.css';

/** Keep the mobile endpoint ticks without changing desktop labels. */
function legendTick(row: BarDatum, index: number, x: number, y: number): JSX.Element {
  return (
    <text
      class="lui-bar-chart__tick"
      data-mobile-hidden={[0, 2, 3].includes(index) ? '' : undefined}
      x={x}
      y={y}
      text-anchor="middle"
    >
      {String(row.category ?? '')}
    </text>
  );
}

/** Place four independent quality bars in each category band. */
export function BarChartMultiple(): JSX.Element {
  return (
    <BarChart
      data={qualityData}
      xKey="type"
      series={qualitySeries}
      showLegend
      legendPlacement="top-right"
      tooltip
    />
  );
}

/** Show the request value and maximum series beside a vertical legend. */
export function BarChartLegendPosition(): JSX.Element {
  return (
    <BarChart
      data={endpointData}
      xKey="category"
      series={[
        { name: 'value', color: 'blue.solid' },
        { name: 'maxValue', color: 'green.solid' },
      ]}
      yDomain={[0, 1000]}
      yTickValues={[0, 250, 500, 750, 1000]}
      class="bar-chart-legend-position"
      xTickRenderer={legendTick}
      showLegend
      legendPlacement="top-right"
      tooltip
    />
  );
}
