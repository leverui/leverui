import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { DataListItemLabel } from '../dist/components/data-list-item-label.js';
import { DataListItemValue } from '../dist/components/data-list-item-value.js';
import { DataListItem } from '../dist/components/data-list-item.js';
import { DataListRoot } from '../dist/components/data-list-root.js';
import { renderDataListHydrationTree } from './data-list-hydration-tree';

/** Attach published Data List behavior to server-rendered markup. */
export function hydrateDataListExample(target: HTMLElement): void {
  /** Mark the host once its server tree is hydrated. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same semantic tree in the browser hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderDataListHydrationTree({
      DataListRoot,
      DataListItem,
      DataListItemLabel,
      DataListItemValue,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
