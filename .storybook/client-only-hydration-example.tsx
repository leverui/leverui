import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { ClientOnly } from '../src';
import { renderClientOnlyHydrationTree } from './client-only-hydration-tree';

/** Attach the client tree to its published server fallback markup. */
export function hydrateClientOnlyExample(target: HTMLElement): void {
  /** Mark the browser hydration pass for focused assertions. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server structure before the mounted branch appears. */
  function renderExample(): JSX.Element {
    const tree = renderClientOnlyHydrationTree({ ClientOnly });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
