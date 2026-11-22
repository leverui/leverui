import { createComponent, type Accessor } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { RadialBarChart as RadialBarChartExport } from '../src/charts/radial-bar-chart';
import type { RadialChart as RadialChartExport } from '../src/charts/radial-chart';

/** Published chart constructors used by both server and browser trees. */
export interface RadialHydrationComponents {
  RadialChart: typeof RadialChartExport;
  RadialBarChart: typeof RadialBarChartExport;
}

/** Render one stable tree whose chart geometry can update after hydration. */
export function renderRadialHydrationTree(
  components: RadialHydrationComponents,
  size: Accessor<number>,
  resize: () => void,
): JSX.Element {
  return createComponent(Dynamic, {
    component: 'div',
    'data-radial-hydration-tree': '',
    /** Keep server and browser children in the same order. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          'data-testid': 'radial-hydration-resize',
          onClick: resize,
          children: 'Resize',
        }),
        createComponent(components.RadialChart, {
          data: [{ name: 'A', value: 10, color: 'teal.solid' }],
          /** Recompute the SVG size after hydration. */
          get size() {
            return size();
          },
          innerRadius: 50,
          label: 'point',
          legend: true,
          'aria-label': 'Hydrated share',
        }),
        createComponent(components.RadialBarChart, {
          data: [{ name: 'B', value: 20, color: 'teal.solid' }],
          /** Keep the ring chart offset from the pie size. */
          get size() {
            return size() + 120;
          },
          label: true,
          legend: true,
          'aria-label': 'Hydrated rings',
        }),
      ];
    },
  });
}
