import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPageText,
  PaginationRoot,
} from '../dist/index.js';
import { renderPaginationHydrationTree } from './pagination-hydration-tree';

/** Attach the published browser entry to server-rendered Pagination markup. */
export function hydratePaginationExample(target: HTMLElement): void {
  /** Mark the browser owner after Solid attaches to existing nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same Pagination machine inside the hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderPaginationHydrationTree({
      PaginationItems,
      PaginationNextTrigger,
      PaginationPageText,
      PaginationRoot,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
