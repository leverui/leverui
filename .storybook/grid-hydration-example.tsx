import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Grid, GridItem } from '../src';
import { renderGridHydrationTree } from './grid-hydration-tree';

/** Attach browser Grid behavior to markup from the published server entry. */
export function hydrateGridExample(target: HTMLElement): void {
  /** Mark the host after Solid has attached to the existing DOM. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the shared Grid tree with browser exports. */
  function renderExample(): JSX.Element {
    const tree = renderGridHydrationTree({ Grid, GridItem });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
