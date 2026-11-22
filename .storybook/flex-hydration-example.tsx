import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Flex } from '../src';
import { renderFlexHydrationTree } from './flex-hydration-tree';

/** Attach browser Flex behavior to published server markup. */
export function hydrateFlexExample(target: HTMLElement): void {
  /** Mark the host when Solid has attached to the server nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the shared tree using browser package exports. */
  function renderExample(): JSX.Element {
    const tree = renderFlexHydrationTree({ Flex });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
