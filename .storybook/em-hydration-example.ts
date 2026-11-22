import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Em } from '../dist/index.js';
import { renderEmHydrationTree } from './em-hydration-tree';

/** Attach the published browser Em to markup from the server entry. */
export function hydrateEmExample(target: HTMLElement): void {
  /** Signal when Solid has attached the interactive tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same native element in the hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderEmHydrationTree({ Em });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
