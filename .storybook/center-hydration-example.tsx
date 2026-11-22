import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Center } from '../src';
import { renderCenterHydrationTree } from './center-hydration-tree';

/** Hydrate published Center markup without replacing its native elements. */
export function hydrateCenterExample(target: HTMLElement): void {
  /** Mark completed attachment for the browser assertion. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the shared tree through browser package exports. */
  function renderExample(): JSX.Element {
    const tree = renderCenterHydrationTree({ Center });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
