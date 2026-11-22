import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Listbox, createListCollection } from '../dist/index.js';
import { renderVirtualizedListbox } from './listbox-virtualized-tree';

/** Hydrate the published client Listbox over the country server fixture. */
export function hydrateVirtualizedListbox(target: HTMLElement): void {
  /** Signal when the published component tree has attached. */
  function renderExample(): JSX.Element {
    const tree = renderVirtualizedListbox({ Listbox, createListCollection });
    onSettled(
      /** Expose completion for the browser's hydration assertion. */
      () => {
        target.dataset.hydrated = 'true';
      },
    );
    return tree;
  }

  hydrate(renderExample, target);
}
