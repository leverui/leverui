import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Show } from '../src';
import { renderShowHydrationTree, type ShowHydrationOptions } from './show-hydration-tree';

/** Hydrate the published Show tree with the same initial condition. */
export function hydrateShowExample(target: HTMLElement, options: ShowHydrationOptions): void {
  /** Mark the first client render after the server nodes have been matched. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server control flow tree for Solid hydration. */
  function renderExample(): JSX.Element {
    const tree = renderShowHydrationTree(Show, options);
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
