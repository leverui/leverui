import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { AvatarFallback, AvatarImage, AvatarRoot } from '../src';
import { renderAvatarHydrationTree } from './avatar-hydration-tree';

/** Attach browser Avatar behavior to the published server nodes. */
export function hydrateAvatarExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches to its existing nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Build the browser half of the shared Avatar tree. */
  function renderExample(): JSX.Element {
    const tree = renderAvatarHydrationTree({
      AvatarRoot,
      AvatarImage,
      AvatarFallback,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
