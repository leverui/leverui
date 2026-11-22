import { createComponent } from 'solid-js';
import { renderToString, type JSX } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { LineChart as LineChartExport } from '../../src';

type ServerComponents = { LineChart: typeof LineChartExport };

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

const data = [
  { month: 'Jan', value: 4 },
  { month: 'Feb', value: 7 },
  { month: 'Mar', value: 5 },
];

/** The chart's grid options, as the tests below change them. */
interface GridOptions {
  readonly showGrid?: boolean;
  readonly gridDashed?: boolean;
  readonly gridVertical?: boolean;
}

/** Render a line chart on the server with some grid options. */
function renderChart(options: GridOptions): string {
  return renderToString(
    /** Create the chart inside the server render. */
    (): JSX.Element =>
      createComponent(server.LineChart, {
        data,
        xKey: 'month',
        series: [{ name: 'value', color: 'cyan.solid' }],
        ...options,
      }),
  );
}

/** Count the grid lines that run across (same y) and up (same x). */
function gridLines(markup: string): { across: number; up: number } {
  const lines = [...markup.matchAll(/<line[^>]*__gridLine[^>]*>/g)].map(
    /** Read one line's tag. */
    (match) => match[0],
  );
  /** Read a numeric attribute from a line's tag. */
  const read = (line: string, name: string): string | undefined =>
    new RegExp(`${name}="([^"]+)"`).exec(line)?.[1];
  return {
    across: lines.filter(
      /** Keep lines whose ends share a height. */
      (line) => read(line, 'y1') === read(line, 'y2'),
    ).length,
    up: lines.filter(
      /** Keep lines whose ends share a position across. */
      (line) => read(line, 'x1') === read(line, 'x2'),
    ).length,
  };
}

/** By default the grid runs across the chart only, so the server output already has it. */
function verifiesDefaultGrid(): void {
  const lines = gridLines(renderChart({}));
  expect(lines.across).toBeGreaterThan(0);
  expect(lines.up).toBe(0);
}

/** `gridVertical` adds lines up the chart, and `gridDashed` marks the grid as dashed. */
function verifiesGridOptions(): void {
  expect(gridLines(renderChart({ gridVertical: true })).up).toBeGreaterThan(0);
  expect(renderChart({ gridDashed: true })).toMatch(/__axes"[^>]*data-grid-dashed/);
  expect(renderChart({})).not.toContain('data-grid-dashed');
}

/** `showGrid={false}` leaves the grid out of the server output entirely. */
function verifiesHiddenGrid(): void {
  expect(renderChart({ showGrid: false })).not.toContain('__gridLine');
}

test('Cartesian grid renders across the chart by default on the server', verifiesDefaultGrid);
test('Cartesian grid options render on the server', verifiesGridOptions);
test('Cartesian grid can be left out on the server', verifiesHiddenGrid);
