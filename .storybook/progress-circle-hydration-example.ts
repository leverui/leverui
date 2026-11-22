import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { ProgressCircle } from '../dist/index.js';
import { renderProgressCircleHydrationTree } from './progress-circle-hydration-tree';

/** Attach published client ProgressCircle to the server-rendered host. */
export function hydrateProgressCircleExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches the machine tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same machine tree from the published browser entry. */
  function renderExample(): JSX.Element {
    const tree = renderProgressCircleHydrationTree({ ProgressCircle });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
