import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Highlight } from '../dist/index.js';
import { renderHighlightHydrationTree } from './highlight-hydration-tree';

/** Hydrate published Highlight over markup from the published server entry. */
export function hydrateHighlightExample(target: HTMLElement): void {
  /** Record when Solid has attached to the existing match tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the matching tree inside the browser hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderHighlightHydrationTree({ Highlight });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
