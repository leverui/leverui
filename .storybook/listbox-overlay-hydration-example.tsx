import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Listbox, Popover, Portal, createListCollection } from '../dist/index.js';
import { renderListboxOverlayHydrationTree } from './listbox-overlay-hydration-tree';

/** Attach published browser overlay parts to published server markup. */
export function hydrateListboxOverlayExample(target: HTMLElement, initialOpen: boolean): void {
  /** Expose successful attachment to the browser assertion. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree under Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderListboxOverlayHydrationTree(
      { Listbox, Popover, Portal, createListCollection },
      initialOpen,
    );
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
