import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { RadialChart as RadialChartExport } from '../../src/charts/radial-chart';

type ServerComponents = { RadialChart: typeof RadialChartExport };
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render a Pie Chart with its legend through the published server entry. */
function renderServerRadialChart(): string {
  return renderToString(
    /** Provide fixed data without a browser pointer or ResizeObserver. */
    () =>
      createComponent(server.RadialChart, {
        data: [
          { name: 'windows', value: 400, color: 'blue.solid' },
          { name: 'mac', value: 300, color: 'orange.solid' },
          { name: 'linux', value: 300, color: 'pink.solid' },
        ],
        legend: true,
        tooltip: true,
        'aria-label': 'Operating systems',
      }),
  );
}

/** Preserve accessible sectors and legend order before hydration. */
function verifiesServerRadialChart(): void {
  const markup = renderServerRadialChart();
  expect(markup).toContain('aria-label="Operating systems"');
  expect(markup).toContain('A 64.8 64.8');
  expect(markup.indexOf('linux')).toBeLessThan(markup.lastIndexOf('windows'));
  expect(markup).not.toContain('role="tooltip"');
}

test('Radial Chart renders sectors and its legend on the server', verifiesServerRadialChart);
