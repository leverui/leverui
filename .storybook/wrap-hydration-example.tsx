import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Wrap, WrapItem } from '../src';
import { renderWrapHydrationTree } from './wrap-hydration-tree';

/** Attach browser Wrap behavior to its published server markup. */
export function hydrateWrapExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches to existing nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree with browser package exports. */
  function renderExample(): JSX.Element {
    const tree = renderWrapHydrationTree({ Wrap, WrapItem });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
