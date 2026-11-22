import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { AspectRatio } from '../dist/index.js';
import { renderAspectRatioHydrationTree } from './aspect-ratio-hydration-tree';

/** Hydrate the published ratio without replacing its native child. */
export function hydrateAspectRatioExample(target: HTMLElement): void {
  /** Mark the completed attachment for browser assertions. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same ratio tree with browser package exports. */
  function renderExample(): JSX.Element {
    const tree = renderAspectRatioHydrationTree({ AspectRatio });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
