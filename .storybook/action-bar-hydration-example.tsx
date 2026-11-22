import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { ActionBar, Button, Portal, Theme } from '../dist/index.js';
import { renderActionBarHydrationTree } from './action-bar-hydration-tree';

/** Attach the browser Action Bar machine to published server markup. */
export function hydrateActionBarExample(
  target: HTMLElement,
  initiallyOpen: boolean,
  portalled = false,
): void {
  /** Mark completion after Solid has reused the existing DOM. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same initial state inside Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderActionBarHydrationTree(
      { ActionBar, Button, Portal, Theme },
      initiallyOpen,
      portalled,
    );
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
