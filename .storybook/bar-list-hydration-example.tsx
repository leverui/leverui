import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { BarList, useChart } from '../dist/index.js';
import { renderBarListHydrationTree } from './bar-list-hydration-tree';

/** Attach the published Bar List browser entry to its server markup. */
export function hydrateBarListExample(target: HTMLElement): void {
  /** Mark the existing host after Solid attaches its owner. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same chart and data under the browser owner. */
  function renderExample(): JSX.Element {
    const tree = renderBarListHydrationTree({ BarList, useChart });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
