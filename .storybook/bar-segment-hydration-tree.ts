import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { BarSegment as BarSegmentExport, useChart as UseChartExport } from '../src';

export interface BarSegmentHydrationComponents {
  BarSegment: typeof BarSegmentExport;
  useChart: typeof UseChartExport;
}

/** Build the same chart tree through server and browser package entries. */
export function renderBarSegmentHydrationTree(
  components: BarSegmentHydrationComponents,
): JSX.Element {
  const chart = components.useChart({
    data: [
      { name: 'Direct', value: 60, color: 'teal.solid' },
      { name: 'Referral', value: 40, color: 'blue.solid' },
    ],
    series: [{ name: 'name', color: 'teal.solid' }],
  });
  return createComponent(components.BarSegment.Root, {
    chart,
    /** Mount chart consumers inside the closest provider. */
    get children(): JSX.Element {
      return [
        createComponent(components.BarSegment.Content, {
          /** Keep labels, segments, and values in one responsive stack. */
          get children(): JSX.Element {
            return [
              createComponent(components.BarSegment.Value, {}),
              createComponent(components.BarSegment.Bar, { tooltip: true }),
              createComponent(components.BarSegment.Label, {}),
            ];
          },
        }),
        createComponent(components.BarSegment.Legend, { showPercent: true }),
      ];
    },
  });
}
