import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  HoverCardArrow,
  HoverCardContent,
  HoverCardPositioner,
  HoverCardRoot,
  HoverCardTrigger,
  Portal,
} from '../dist/index.js';
import { renderHoverCardHydrationTree } from './hover-card-hydration-tree';

/** Attach the Hover Card client tree to published server markup. */
export function hydrateHoverCardExample(target: HTMLElement, initialOpen = false): void {
  /** Mark the tree after Solid attaches to the existing nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree in Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderHoverCardHydrationTree(
      {
        HoverCardArrow,
        HoverCardContent,
        HoverCardPositioner,
        HoverCardRoot,
        HoverCardTrigger,
        Portal,
      },
      initialOpen,
    );
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
