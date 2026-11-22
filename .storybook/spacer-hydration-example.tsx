import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Spacer } from '../src';
import { renderSpacerHydrationTree } from './spacer-hydration-tree';

/** Attach browser Spacer behavior to published server markup. */
export function hydrateSpacerExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches to its existing DOM. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server's Spacer tree through browser exports. */
  function renderExample(): JSX.Element {
    const tree = renderSpacerHydrationTree({ Spacer });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
