import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Group } from '../src';
import { renderGroupHydrationTree } from './group-hydration-tree';

/** Attach browser Group behavior to markup from the published server entry. */
export function hydrateGroupExample(target: HTMLElement): void {
  /** Mark the host after Solid has attached to the existing DOM. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the shared Group tree through browser exports. */
  function renderExample(): JSX.Element {
    const tree = renderGroupHydrationTree({ Group });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
