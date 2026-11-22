import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Square } from '../src';
import { renderSquareHydrationTree } from './square-hydration-tree';

/** Hydrate published Square markup without replacing its native nodes. */
export function hydrateSquareExample(target: HTMLElement): void {
  /** Mark completed attachment for the browser assertion. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the shared tree through browser package exports. */
  function renderExample(): JSX.Element {
    const tree = renderSquareHydrationTree({ Square });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
