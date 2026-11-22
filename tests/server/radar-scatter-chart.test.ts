import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { RadarChart as RadarChartExport } from '../../src/charts/radar-chart';
import type { ScatterChart as ScatterChartExport } from '../../src/charts/scatter-chart';

type ServerCharts = {
  RadarChart: typeof RadarChartExport;
  ScatterChart: typeof ScatterChartExport;
};
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerCharts;

/** Render both published charts without DOM measurement or browser APIs. */
function renderCharts(): string {
  return renderToString(
    /** Keep both charts inside one server-rendered tree. */
    () => [
      createComponent(server.RadarChart, {
        data: [{ label: 'January', value: 20 }],
        series: [{ name: 'value', color: 'teal.solid' }],
        grid: 'filled',
        legend: true,
        class: 'consumer-radar',
        'aria-label': 'Published radar chart',
      }),
      createComponent(server.ScatterChart, {
        data: [{ x: 1, y: 2 }],
        xKey: 'x',
        yKey: 'y',
        series: [{ name: 'value', color: 'teal.solid' }],
        trendLine: true,
        class: 'consumer-scatter',
        'aria-label': 'Published scatter chart',
      }),
    ],
  );
}

/** Verify server output exposes semantic SVG nodes and authored CSS hooks. */
function verifiesPublishedCharts(): void {
  const markup = renderCharts();
  expect(markup).toContain('aria-label="Published radar chart"');
  expect(markup).toContain('aria-label="Published scatter chart"');
  expect(markup).toContain('leverui-radar-chart__grid');
  expect(markup).toContain('leverui-scatter-chart__axes');
  expect(markup).toContain('consumer-radar');
  expect(markup).toContain('consumer-scatter');
}

test('published Radar and Scatter Charts render without browser APIs', verifiesPublishedCharts);
