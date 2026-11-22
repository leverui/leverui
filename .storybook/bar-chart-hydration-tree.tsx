import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { BarChart as BarChartExport } from '../src/charts/bar-chart';

export interface BarChartHydrationComponents {
  BarChart: typeof BarChartExport;
}

const data = [
  { category: 'January', value: 20 },
  { category: 'February', value: 32 },
];

/** Share one native chart tree between published server and browser entries. */
export function renderBarChartHydrationTree(components: BarChartHydrationComponents): JSX.Element {
  return createComponent(components.BarChart, {
    data,
    xKey: 'category',
    series: [{ name: 'value', color: 'teal.solid', label: true }],
    showLegend: true,
    style: { width: '320px' },
    'aria-label': 'Hydrated Bar Chart',
  });
}
