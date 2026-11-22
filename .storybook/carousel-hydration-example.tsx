import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  CarouselItem,
  CarouselItemGroup,
  CarouselNextTrigger,
  CarouselProgressText,
  CarouselRoot,
} from '../dist/index.js';
import { renderCarouselHydrationTree } from './carousel-hydration-tree';

/** Attach the published browser entry to server-rendered Carousel markup. */
export function hydrateCarouselExample(target: HTMLElement): void {
  /** Mark the browser owner after Solid attaches to existing nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same machine tree inside the hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderCarouselHydrationTree({
      CarouselItem,
      CarouselItemGroup,
      CarouselNextTrigger,
      CarouselProgressText,
      CarouselRoot,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
