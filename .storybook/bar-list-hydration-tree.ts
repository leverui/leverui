import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { BarList as BarListExport, useChart as UseChartExport } from '../src';

export interface BarListHydrationComponents {
  BarList: typeof BarListExport;
  useChart: typeof UseChartExport;
}

/** Build one identical Bar List tree for server and browser entries. */
export function renderBarListHydrationTree(components: BarListHydrationComponents): JSX.Element {
  const chart = components.useChart({
    data: [
      { name: 'Direct', value: 50 },
      { name: 'Referral', value: 25 },
    ],
    series: [{ name: 'name', color: 'teal.subtle' }],
  });
  return createComponent(components.BarList.Root, {
    chart,
    /** Attach row consumers after the chart provider is mounted. */
    get children(): JSX.Element {
      return createComponent(components.BarList.Content, {
        /** Pair accessible bars and values under one chart model. */
        get children(): JSX.Element {
          return [
            createComponent(components.BarList.Bar, { tooltip: true }),
            createComponent(components.BarList.Value, {}),
          ];
        },
      });
    },
  });
}
