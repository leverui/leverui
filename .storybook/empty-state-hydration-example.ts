import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { EmptyState } from '../dist/index.js';
import { renderEmptyStateHydrationTree } from './empty-state-hydration-tree';

/** Attach the published client Empty State to existing server markup. */
export function hydrateEmptyStateExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches the compound tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server's tree from the published browser entry. */
  function renderExample(): JSX.Element {
    const tree = renderEmptyStateHydrationTree({ EmptyState });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
