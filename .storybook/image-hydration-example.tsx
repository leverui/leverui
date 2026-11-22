import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Image } from '../src';
import { renderImageHydrationTree } from './image-hydration-tree';

/** Attach browser Image behavior to markup from the published server entry. */
export function hydrateImageExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches to the existing image. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same Image tree through browser exports. */
  function renderExample(): JSX.Element {
    const tree = renderImageHydrationTree({ Image });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
