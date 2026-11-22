import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  Portal,
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger,
} from '../dist/index.js';
import { renderTooltipHydrationTree } from './tooltip-hydration-tree';

/** Attach the Tooltip client tree to published server markup. */
export function hydrateTooltipExample(target: HTMLElement, initialOpen: boolean): void {
  /** Mark the tree after Solid attaches to its existing nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree in Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderTooltipHydrationTree(
      { Portal, TooltipContent, TooltipPositioner, TooltipRoot, TooltipTrigger },
      initialOpen,
    );
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
