import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { VisuallyHidden } from '../dist/index.js';
import { renderVisuallyHiddenHydrationTree } from './visually-hidden-hydration-tree';

/** Hydrate the published hidden content without replacing its native nodes. */
export function hydrateVisuallyHiddenExample(target: HTMLElement): void {
  /** Signal when the client tree has attached to server markup. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same native hidden elements on the client. */
  function renderExample(): JSX.Element {
    const tree = renderVisuallyHiddenHydrationTree({ VisuallyHidden });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
