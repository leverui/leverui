import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Circle } from '../src';
import { renderCircleHydrationTree } from './circle-hydration-tree';

/** Hydrate published Circle markup without replacing its native element. */
export function hydrateCircleExample(target: HTMLElement): void {
  /** Mark completed attachment for the browser assertion. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the shared tree through browser package exports. */
  function renderExample(): JSX.Element {
    const tree = renderCircleHydrationTree({ Circle });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
