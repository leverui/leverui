import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { BarList as BarListExport, useChart as UseChartExport } from '../../src';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as {
  BarList: typeof BarListExport;
  useChart: typeof UseChartExport;
};

/** Render the packed Bar List composition without a style provider. */
function renderBarList(barSize?: string): string {
  return renderToString(
    /** Create the chart inside Solid's server owner. */
    () => {
      const chart = server.useChart({
        data: [
          { name: 'Direct', value: 50 },
          { name: 'Referral', value: 25 },
        ],
        series: [
          { name: 'value', color: 'red.solid' },
          { name: 'name', color: 'teal.subtle' },
        ],
      });
      return createComponent(server.BarList.Root, {
        chart,
        barSize,
        id: 'server-bar-list',
        'aria-label': 'Server traffic',
        /** Keep rows beneath the nearest Bar List chart context. */
        get children(): JSX.Element {
          return createComponent(server.BarList.Content, {
            /** Pair the bar and numeric value columns. */
            get children(): JSX.Element {
              return [
                createComponent(server.BarList.Bar, { id: 'server-bar-column' }),
                createComponent(server.BarList.Value, { 'aria-label': 'Server values' }),
              ];
            },
          });
        },
      });
    },
  );
}

/** Require static classes and only data-driven native style values. */
function verifiesBarListMarkup(): void {
  const markup = renderBarList();
  expect(markup).toContain('leverui-bar-list__root');
  expect(markup).toContain('leverui-bar-list__row');
  expect(markup).toContain('leverui-bar-list__fill');
  expect(markup).toContain('leverui-bar-list__valueRow');
  expect(markup).toContain('id="server-bar-list"');
  expect(markup).toContain('aria-label="Server traffic"');
  expect(markup).toContain('id="server-bar-column"');
  expect(markup).toContain('aria-label="Server values"');
  expect(markup).toContain('--lui-private-bar-list-color:var(--lui-colors-teal-subtle)');
  expect(markup).toContain('--lui-private-bar-list-width:100%');
  expect(markup).not.toMatch(/style="[^"]*(?:display|font-size|border-radius):/);
  expect(renderBarList('3rem')).toContain('--lui-bar-list-size:3rem');
  expect(renderBarList('12')).toContain('--lui-bar-list-size:var(--lui-spacing-12, 3rem)');
}

test('Bar List server output relies on authored CSS for presentation', verifiesBarListMarkup);
