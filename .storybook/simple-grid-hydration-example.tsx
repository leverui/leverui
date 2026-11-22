import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { SimpleGrid } from '../src';
import { renderSimpleGridHydrationTree } from './simple-grid-hydration-tree';

/** Attach browser SimpleGrid behavior to published server markup. */
export function hydrateSimpleGridExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches to its existing DOM. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server's SimpleGrid tree through browser exports. */
  function renderExample(): JSX.Element {
    const tree = renderSimpleGridHydrationTree({ SimpleGrid });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
