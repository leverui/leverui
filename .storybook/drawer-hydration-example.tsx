import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  DrawerBackdrop,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerDescription,
  DrawerPositioner,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
  Portal,
} from '../src';
import { renderDrawerHydrationTree } from './drawer-hydration-tree';

/** Attach the published Drawer tree to its server trigger. */
export function hydrateDrawerExample(
  target: HTMLElement,
  initialOpen = false,
  responsive = false,
): void {
  /** Mark completion after Solid hydrates the existing trigger. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree inside Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderDrawerHydrationTree(
      {
        DrawerBackdrop,
        DrawerCloseTrigger,
        DrawerContent,
        DrawerDescription,
        DrawerPositioner,
        DrawerRoot,
        DrawerTitle,
        DrawerTrigger,
        Portal,
      },
      initialOpen,
      responsive,
    );
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
