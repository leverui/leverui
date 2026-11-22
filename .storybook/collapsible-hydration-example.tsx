import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Collapsible } from '../src';
import { renderCollapsibleHydrationTree } from './collapsible-hydration-tree';

/** Attach browser Collapsible behavior to published server markup. */
export function hydrateCollapsibleExample(target: HTMLElement, initiallyOpen: boolean): void {
  /** Mark completion after Solid has claimed the existing DOM. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the initial state inside Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderCollapsibleHydrationTree({ Collapsible }, initiallyOpen);
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
