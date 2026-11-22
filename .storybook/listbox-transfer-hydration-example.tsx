import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  Center,
  Flex,
  IconButton,
  Listbox,
  VisuallyHidden,
  VStack,
  createListCollection,
} from '../dist/index.js';
import { renderListboxTransferTree } from './listbox-transfer-tree';

/** Attach the published browser package to the server transfer tree. */
export function hydrateListboxTransferExample(target: HTMLElement): void {
  /** Mark completion only after Solid attaches the interactive tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the exact server composition and collection order. */
  function renderExample(): JSX.Element {
    const tree = renderListboxTransferTree({
      Center,
      Flex,
      IconButton,
      Listbox,
      VisuallyHidden,
      VStack,
      createListCollection,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
