import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { RadioCard } from '../dist/index.js';
import { renderRadioCardHydrationTree } from './radio-card-hydration-tree';

/** Attach published browser Radio Card machines to server markup. */
export function hydrateRadioCardExample(target: HTMLElement): void {
  /** Mark the root after Solid attaches the client tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same JSX tree before hydration. */
  function renderExample(): JSX.Element {
    const tree = renderRadioCardHydrationTree({ RadioCard });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
