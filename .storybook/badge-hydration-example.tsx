import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Badge, BadgePropsProvider } from '../dist/index.js';
import { renderBadgeHydrationTree } from './badge-hydration-tree';

/** Attach browser Badge behavior to an existing server tree. */
export function hydrateBadgeExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches to the server nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the shared tree inside the hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderBadgeHydrationTree({ Badge, BadgePropsProvider });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
