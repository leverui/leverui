import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Float } from '../src';
import { renderFloatHydrationTree } from './float-hydration-tree';

/** Attach browser Float behavior to published server markup. */
export function hydrateFloatExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches to the server nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the shared tree with browser package exports. */
  function renderExample(): JSX.Element {
    const tree = renderFloatHydrationTree({ Float });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
