import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Combobox, createListCollection } from '../dist/index.js';
import { renderComboboxHydrationTree } from './combobox-hydration-tree';

/** Attach live Combobox machines to the published server markup. */
export function hydrateComboboxExample(target: HTMLElement): void {
  /** Signal that Solid finished attaching the client tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the exact server component tree before hydration. */
  function renderExample(): JSX.Element {
    const tree = renderComboboxHydrationTree({ Combobox, createListCollection });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
