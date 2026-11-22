import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { RadialBarChart as RadialBarChartExport } from '../../src/charts/radial-bar-chart';

type ServerComponents = { RadialBarChart: typeof RadialBarChartExport };
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render labeled rings through the published server entry. */
function renderServerRadialBars(): string {
  return renderToString(
    /** Keep both label paths within one server-rendered chart. */
    () =>
      createComponent(server.RadialBarChart, {
        data: [
          { name: 'January', value: 165, color: 'teal.solid' },
          { name: 'February', value: 190, color: 'purple.solid' },
        ],
        label: true,
        'aria-label': 'Monthly radial values',
      }),
  );
}

/** Keep curved label references unique and present in server markup. */
function verifiesServerRadialBars(): void {
  const markup = renderServerRadialBars();
  const ids = [...markup.matchAll(/id="(leverui-radial-label-[^"]+)"/g)].map(
    /** Capture each server-generated SVG path identifier. */
    (match) => match[1],
  );
  expect(ids).toHaveLength(2);
  expect(new Set(ids).size).toBe(2);
  for (const id of ids) expect(markup).toContain(`href="#${id}"`);
  expect(markup).toContain('aria-label="Monthly radial values"');
}

test('Radial Bar Chart renders unique curved labels on the server', verifiesServerRadialBars);
