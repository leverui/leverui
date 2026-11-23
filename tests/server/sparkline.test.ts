import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { Sparkline as SparklineExport } from '../../src/charts/sparkline';

type ServerComponents = { Sparkline: typeof SparklineExport };
const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render a responsive chart before a browser can measure its actual width. */
function renderServerSparkline(): string {
  return renderToString(
    /** Supply two points through the published server component entry. */
    () =>
      createComponent(server.Sparkline, {
        data: [{ value: 10 }, { value: 20 }],
        width: '100%',
        'aria-label': 'Server chart',
      }),
  );
}

/** Keep responsive sizing and browser observers safe during server rendering. */
function verifiesServerSparkline(): void {
  const markup = renderServerSparkline();
  expect(markup).toContain('aria-label="Server chart"');
  expect(markup).toContain('viewBox="0 0 112 48"');
  expect(markup).toContain('leverui-sparkline');
  expect(markup).not.toContain('width="100%"');
  expect(markup).toContain('--lui-sparkline-width:100%');
  expect(markup).not.toContain('display:block');
}

test('Sparkline renders a responsive fallback on the server', verifiesServerSparkline);

/** Keep native class and style overrides in the published server markup. */
function verifiesNativeSparklineProps(): void {
  const markup = renderToString(
    /** Render caller classes and CSS after internal geometry variables. */
    () =>
      createComponent(server.Sparkline, {
        data: [{ value: 10 }],
        color: 'green.solid',
        class: 'consumer-chart',
        style: '--lui-sparkline-color:rgb(1, 2, 3)',
      }),
  );
  expect(markup).toContain('class="leverui-sparkline consumer-chart"');
  expect(markup).toContain('--lui-sparkline-color:rgb(1, 2, 3)');
}

test('Sparkline preserves native class and CSS overrides', verifiesNativeSparklineProps);
