import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Sticky } from '../src';
import { renderStickyHydrationTree } from './sticky-hydration-tree';

/** Attach the browser Sticky tree to its published server markup. */
export function hydrateStickyExample(target: HTMLElement): void {
  /** Mark the host after Solid has attached to its existing nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree with the browser package exports. */
  function renderExample(): JSX.Element {
    const tree = renderStickyHydrationTree({ Sticky });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
