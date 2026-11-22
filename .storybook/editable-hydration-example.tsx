import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Editable } from '../src';
import { renderEditableHydrationTree } from './editable-hydration-tree';

/** Attach Editable controls to published server nodes without replacing them. */
export function hydrateEditableExample(target: HTMLElement): void {
  /** Mark the end of Solid's attachment for browser assertions. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same machine tree inside Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderEditableHydrationTree({ Editable });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
