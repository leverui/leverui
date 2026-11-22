import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Sparkline } from '../dist/index.js';
import { renderSparklineHydrationTree } from './sparkline-hydration-tree';

/** Attach the browser chart to its published server SVG. */
export function hydrateSparklineExample(target: HTMLElement): void {
  /** Mark the point when the responsive chart is mounted. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Render the same chart while Solid tracks its hydration IDs. */
  function renderExample(): JSX.Element {
    const tree = renderSparklineHydrationTree({ Sparkline });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
