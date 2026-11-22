import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { AreaChart as AreaChartExport, LineChart as LineChartExport } from '../src';

/** Public chart entries needed by the shared server/client fixture. */
export interface CartesianHydrationComponents {
  AreaChart: typeof AreaChartExport;
  LineChart: typeof LineChartExport;
}

/** Render the same responsive chart tree on server and client. */
export function renderCartesianHydrationTree(
  components: CartesianHydrationComponents,
  kind: 'area' | 'line',
): JSX.Element {
  const props = {
    data: [
      { month: 'Jan', visits: 20 },
      { month: 'Feb', visits: 50 },
    ],
    xKey: 'month',
    series: [{ name: 'visits', color: 'teal.solid' }],
    height: 240,
    showLegend: true,
    'aria-label': `Hydrated ${kind} chart`,
  };
  return kind === 'area'
    ? createComponent(components.AreaChart, props)
    : createComponent(components.LineChart, props);
}
