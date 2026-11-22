import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  MenuArrow,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  Portal,
} from '../dist/index.js';
import { renderMenuHydrationTree } from './menu-hydration-tree';

/** Attach the menu client tree to published server markup. */
export function hydrateMenuExample(target: HTMLElement, initialOpen = false): void {
  /** Mark the tree after Solid attaches to its existing nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree in Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderMenuHydrationTree(
      {
        MenuArrow,
        MenuContent,
        MenuItem,
        MenuPositioner,
        MenuRoot,
        MenuTrigger,
        Portal,
      },
      initialOpen,
    );
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
