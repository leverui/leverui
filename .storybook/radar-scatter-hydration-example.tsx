import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { RadarChart, ScatterChart } from '../dist/index.js';
import { renderRadarScatterHydrationTree } from './radar-scatter-hydration-tree';

/** Attach both published browser charts to their published server nodes. */
export function hydrateRadarScatterExample(target: HTMLElement): void {
  /** Mark the completed client mount for the browser assertion. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Render identical chart data while Solid tracks hydration IDs. */
  function renderExample(): JSX.Element {
    const tree = renderRadarScatterHydrationTree({ RadarChart, ScatterChart });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
