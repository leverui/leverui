import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { CardBody, CardRoot, CardTitle } from '../src';
import { renderCardHydrationTree } from './card-hydration-tree';

/** Attach browser Card behavior to the server-rendered root. */
export function hydrateCardExample(target: HTMLElement): void {
  /** Mark the existing markup after Solid hydrates it. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the shared Card tree inside the hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderCardHydrationTree({ CardRoot, CardBody, CardTitle });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
