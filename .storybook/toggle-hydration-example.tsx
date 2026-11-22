import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Button, Toggle } from '../dist/index.js';
import { renderToggleHydrationTree } from './toggle-hydration-tree';

/** Attach the published browser Toggle to its existing server markup. */
export function hydrateToggleExample(target: HTMLElement): void {
  /** Mark the host after the client tree attaches. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the exact server tree before attaching event handlers. */
  function renderExample(): JSX.Element {
    const tree = renderToggleHydrationTree({ Button, Toggle });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
