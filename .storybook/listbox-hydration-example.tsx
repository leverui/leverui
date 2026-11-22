import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Listbox, createListCollection } from '../dist/index.js';
import { renderListboxHydrationTree } from './listbox-hydration-tree';

/** Attach published browser Listbox machines to published server markup. */
export function hydrateListboxExample(target: HTMLElement): void {
  /** Mark the root after Solid finishes attaching the client tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same JSX tree and collection before hydration. */
  function renderExample(): JSX.Element {
    const tree = renderListboxHydrationTree({ Listbox, createListCollection });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
