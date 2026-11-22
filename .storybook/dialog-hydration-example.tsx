import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogDescription,
  DialogPositioner,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  Portal,
  type DialogRootProps,
} from '../src';
import { renderDialogHydrationTree } from './dialog-hydration-tree';

/** Attach the published Dialog tree to its server trigger. */
export function hydrateDialogExample(
  target: HTMLElement,
  initialOpen = false,
  size?: DialogRootProps['size'],
): void {
  /** Mark completion after Solid hydrates the existing trigger. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree inside Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderDialogHydrationTree(
      {
        DialogBackdrop,
        DialogCloseTrigger,
        DialogContent,
        DialogDescription,
        DialogPositioner,
        DialogRoot,
        DialogTitle,
        DialogTrigger,
        Portal,
      },
      initialOpen,
      size,
    );
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
