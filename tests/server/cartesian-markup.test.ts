import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { AreaChart as AreaChartExport, LineChart as LineChartExport } from '../../src';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as {
  AreaChart: typeof AreaChartExport;
  LineChart: typeof LineChartExport;
};

/** Render both public Cartesian families from the published server entry. */
function renderCartesian(kind: 'area' | 'line'): string {
  const chart = kind === 'area' ? server.AreaChart : server.LineChart;
  return renderToString(
    /** Keep server rendering inside Solid's owner. */
    () =>
      createComponent(chart, {
        data: [
          { month: 'Jan', visits: 25 },
          { month: 'Feb', visits: 50 },
        ],
        xKey: 'month',
        series: [{ name: 'visits', color: 'teal.solid' }],
        id: `server-${kind}-chart`,
        'aria-label': `Server ${kind} chart`,
        class: 'consumer-chart',
        style: { width: '420px' },
        height: 260,
        plotMargin: { left: 40, top: 40 },
        gridHorizontal: false,
        showLegend: true,
        showYAxis: true,
      }),
  );
}

/** Require stable hooks and geometry-only native styles before hydration. */
function verifiesCartesianMarkup(): void {
  for (const kind of ['area', 'line'] as const) {
    const markup = renderCartesian(kind);
    expect(markup).toContain(`id="server-${kind}-chart"`);
    expect(markup).toContain(`leverui-${kind}-chart`);
    expect(markup).toContain('leverui-cartesian-chart__root');
    expect(markup).toContain('leverui-cartesian-chart__svg');
    expect(markup).toContain('leverui-cartesian-chart__axes');
    expect(markup).toContain('leverui-cartesian-chart__legend');
    expect(markup).toContain('consumer-chart');
    expect(markup).toContain('width:420px');
    expect(markup).not.toMatch(/plotMargin|gridHorizontal/);
    expect(markup).not.toMatch(/style="[^"]*(?:position|display|font-size|padding|border-radius):/);
  }
}

test(
  'published Area and Line charts render CSS hooks without runtime presentation',
  verifiesCartesianMarkup,
);
