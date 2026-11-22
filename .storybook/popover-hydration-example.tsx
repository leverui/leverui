import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  PopoverArrow,
  PopoverCloseTrigger,
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTitle,
  PopoverTrigger,
  Portal,
} from '../dist/index.js';
import { renderPopoverHydrationTree } from './popover-hydration-tree';

/** Attach the Popover client tree to published server markup. */
export function hydratePopoverExample(target: HTMLElement, initialOpen = false): void {
  /** Mark the tree after Solid attaches to its existing nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree in Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderPopoverHydrationTree(
      {
        PopoverArrow,
        PopoverCloseTrigger,
        PopoverContent,
        PopoverPositioner,
        PopoverRoot,
        PopoverTitle,
        PopoverTrigger,
        Portal,
      },
      initialOpen,
    );
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
