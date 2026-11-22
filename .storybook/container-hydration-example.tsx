import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Container } from '../src';
import { renderContainerHydrationTree } from './container-hydration-tree';

/** Attach Container behavior to published server markup. */
export function hydrateContainerExample(target: HTMLElement): void {
  /** Mark the host once Solid has attached to its server nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the shared tree through browser package exports. */
  function renderExample(): JSX.Element {
    const tree = renderContainerHydrationTree({ Container });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
