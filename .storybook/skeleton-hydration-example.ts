import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Skeleton, SkeletonText } from '../dist/index.js';
import { renderSkeletonHydrationTree } from './skeleton-hydration-tree';

/** Attach published browser placeholders to their server markup. */
export function hydrateSkeletonExample(target: HTMLElement): void {
  /** Record when the browser has attached the tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same tree from the published browser entry. */
  function renderExample(): JSX.Element {
    const tree = renderSkeletonHydrationTree({ Skeleton, SkeletonText });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
