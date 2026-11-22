import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { AreaChart, LineChart } from '../dist/index.js';
import { renderCartesianHydrationTree } from './cartesian-hydration-tree';

/** Attach the published chart client entry to its server output. */
export function hydrateCartesianExample(target: HTMLElement, kind: 'area' | 'line'): void {
  /** Mark the host after Solid has hydrated its existing nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }
  /** Recreate the server's chart tree under the browser owner. */
  function renderExample(): JSX.Element {
    const tree = renderCartesianHydrationTree({ AreaChart, LineChart }, kind);
    onSettled(markHydrated);
    return tree;
  }
  hydrate(renderExample, target);
}
