import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { BarChart } from '../dist/index.js';
import { renderBarChartHydrationTree } from './bar-chart-hydration-tree';

/** Attach published browser behavior to the existing server chart nodes. */
export function hydrateBarChartExample(target: HTMLElement): void {
  /** Signal when the responsive measurement has mounted. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Keep the server and client chart trees identical during hydration. */
  function renderExample(): JSX.Element {
    const tree = renderBarChartHydrationTree({ BarChart });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
