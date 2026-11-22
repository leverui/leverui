import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { RadarChart as RadarChartExport } from '../src/charts/radar-chart';
import type { ScatterChart as ScatterChartExport } from '../src/charts/scatter-chart';

/** Published components shared by server rendering and client hydration. */
export interface RadarScatterHydrationComponents {
  RadarChart: typeof RadarChartExport;
  ScatterChart: typeof ScatterChartExport;
}

/** Render stable chart inputs on both sides of the hydration boundary. */
export function renderRadarScatterHydrationTree(
  components: RadarScatterHydrationComponents,
): JSX.Element {
  return [
    createComponent(components.RadarChart, {
      data: [
        { label: 'A', value: 20 },
        { label: 'B', value: 30 },
        { label: 'C', value: 40 },
      ],
      series: [{ name: 'value', color: 'teal.solid' }],
      legend: true,
      'aria-label': 'Hydrated radar chart',
    }),
    createComponent(components.ScatterChart, {
      data: [
        { x: 1, y: 2 },
        { x: 2, y: 4 },
      ],
      xKey: 'x',
      yKey: 'y',
      series: [{ name: 'value', color: 'teal.solid' }],
      showLegend: true,
      'aria-label': 'Hydrated scatter chart',
    }),
  ];
}
