import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Progress } from '../dist/index.js';
import { renderProgressHydrationTree } from './progress-hydration-tree';

/** Attach published client Progress to the server-rendered host. */
export function hydrateProgressExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches the machine tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same machine tree from the published browser entry. */
  function renderExample(): JSX.Element {
    const tree = renderProgressHydrationTree({ Progress });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
