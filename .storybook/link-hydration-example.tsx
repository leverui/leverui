import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Link, LinkBox, LinkOverlay, LinkPropsProvider } from '../dist/index.js';
import { renderLinkHydrationTree } from './link-hydration-tree';

/** Attach the published browser components to their server-rendered nodes. */
export function hydrateLinkExample(target: HTMLElement): void {
  /** Mark the target once Solid finishes mounting its hydrated tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree under Solid's hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderLinkHydrationTree({
      Link,
      LinkBox,
      LinkOverlay,
      LinkPropsProvider,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
