import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { BarSegment as BarSegmentExport, useChart as UseChartExport } from '../../src';

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as {
  BarSegment: typeof BarSegmentExport;
  useChart: typeof UseChartExport;
};

/** Render the published Bar Segment composition without a style provider. */
function renderBarSegment(barSize?: string): string {
  return renderToString(
    /** Construct the model under Solid's server owner. */
    () => {
      const chart = server.useChart({
        data: [
          { name: 'Direct', value: 60, color: 'teal.solid' },
          { name: 'Referral', value: 40, color: 'blue.solid' },
        ],
        series: [{ name: 'name', color: 'teal.solid' }],
      });
      return createComponent(server.BarSegment.Root, {
        chart,
        barSize,
        id: 'server-bar-segment',
        'aria-label': 'Server segments',
        /** Mount the chart pieces beneath its provider. */
        get children(): JSX.Element {
          return createComponent(server.BarSegment.Content, {
            id: 'server-segment-content',
            /** Align values, segments, and labels to the same data model. */
            get children(): JSX.Element {
              return [
                createComponent(server.BarSegment.Value, {}),
                createComponent(server.BarSegment.Bar, { tooltip: true, 'aria-label': 'Bars' }),
                createComponent(server.BarSegment.Label, {}),
              ];
            },
          });
        },
      });
    },
  );
}

/** Require stable hooks and only geometry or color in native styles. */
function verifiesBarSegmentMarkup(): void {
  const markup = renderBarSegment();
  expect(markup).toContain('leverui-bar-segment__root');
  expect(markup).toContain('leverui-bar-segment__segment');
  expect(markup).toContain('leverui-bar-segment__valueItem');
  expect(markup).toContain('leverui-bar-segment__labelItem');
  expect(markup).toContain('id="server-bar-segment"');
  expect(markup).toContain('aria-label="Server segments"');
  expect(markup).toContain('id="server-segment-content"');
  expect(markup).toContain('aria-label="Bars"');
  expect(markup).toContain('--lui-private-bar-segment-flex:60 1 0');
  expect(markup).not.toMatch(/style="[^"]*(?:display|font-size|border-radius):/);
  expect(renderBarSegment('3rem')).toContain('--lui-bar-segment-size:3rem');
  expect(renderBarSegment('12')).toContain('--lui-bar-segment-size:var(--lui-spacing-12, 3rem)');
}

test('Bar Segment server output uses authored presentation', verifiesBarSegmentMarkup);
