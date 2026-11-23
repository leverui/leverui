import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { BarChart as BarChartExport } from '../../src/charts/bar-chart';

type ServerComponents = { BarChart: typeof BarChartExport };
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render signed bars through the public server entry without browser APIs. */
function renderServerBars(): string {
  return renderToString(
    /** Supply a category and a signed numeric domain to the chart. */
    () =>
      createComponent(server.BarChart, {
        data: [
          { category: 'Gain', value: 200 },
          { category: 'Loss', value: -100 },
        ],
        xKey: 'category',
        series: [{ name: 'value', color: 'teal.solid' }],
        yDomain: [-200, 200],
        'aria-label': 'Signed results',
      }),
  );
}

/** Verify that SSR keeps the chart label, marks, and category text. */
function verifiesServerBars(): void {
  const markup = renderServerBars();
  expect(markup).toContain('aria-label="Signed results"');
  expect(markup).toMatch(/class="lui-bar-chart(?:\s|")/);
  expect(markup).toContain('data-orientation="vertical"');
  expect(markup).toContain('lui-bar-chart__svg');
  expect(markup).toContain('lui-bar-chart__grid-line');
  expect(markup).toContain('data-bar-category="Gain"');
  expect(markup).toContain('data-bar-category="Loss"');
  expect(markup).toContain('data-bar-axes');
  expect(markup).not.toContain('position:relative');
}

test('Bar Chart renders signed marks on the server', verifiesServerBars);
