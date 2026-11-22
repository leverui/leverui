import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Separator } from '../dist/index.js';
import { renderSeparatorHydrationTree } from './separator-hydration-tree';

/** Attach the published browser Separator to matching server markup. */
export function hydrateSeparatorExample(target: HTMLElement): void {
  /** Mark the completed client attachment on its host. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same separator from the browser package entry. */
  function renderExample(): JSX.Element {
    const tree = renderSeparatorHydrationTree({ Separator });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
