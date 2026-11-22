import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { For } from '../dist/index.js';
import { renderForHydrationTree } from './for-hydration-tree';

/** Hydrate the published server list through the browser export. */
export function hydrateForExample(target: HTMLElement): void {
  /** Mark completion of the first browser hydration pass. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server list before mounted callbacks run. */
  function renderExample(): JSX.Element {
    const tree = renderForHydrationTree({ For });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
