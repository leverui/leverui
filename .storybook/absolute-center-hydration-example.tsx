import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { AbsoluteCenter } from '../dist/index.js';
import { renderAbsoluteCenterHydrationTree } from './absolute-center-hydration-tree';

/** Attach the client center to published server markup. */
export function hydrateAbsoluteCenterExample(target: HTMLElement): void {
  /** Signal that hydration has attached event handlers. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same centered element on the client. */
  function renderExample(): JSX.Element {
    const tree = renderAbsoluteCenterHydrationTree({ AbsoluteCenter });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
