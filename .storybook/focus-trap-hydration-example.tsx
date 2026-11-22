import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { FocusTrap } from '../src';
import { renderFocusTrapHydrationTree } from './focus-trap-hydration-tree';

/** Attach the Focus Trap client tree to published server markup. */
export function hydrateFocusTrapExample(target: HTMLElement, initialActive = false): void {
  /** Mark completion after Solid attaches to the server nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree inside Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderFocusTrapHydrationTree({ FocusTrap }, initialActive);
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
