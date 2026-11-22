import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { MarqueeContent, MarqueeItem, MarqueeRoot, MarqueeViewport } from '../dist/index.js';
import { renderMarqueeHydrationTree } from './marquee-hydration-tree';

/** Attach the published browser entry to server-rendered Marquee markup. */
export function hydrateMarqueeExample(target: HTMLElement): void {
  /** Mark the browser owner after Solid attaches to existing nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server machine tree inside the hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderMarqueeHydrationTree({
      MarqueeRoot,
      MarqueeViewport,
      MarqueeContent,
      MarqueeItem,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
