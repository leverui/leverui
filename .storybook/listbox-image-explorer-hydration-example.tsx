import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  Box,
  Flex,
  Image,
  Listbox,
  Text,
  VisuallyHidden,
  createListCollection,
} from '../dist/index.js';
import { renderImageExplorerTree } from './listbox-image-explorer-tree';

const components = {
  Box,
  Flex,
  Image,
  Listbox,
  Text,
  VisuallyHidden,
  createListCollection,
};

/** Attach the published browser explorer to its matching server markup. */
export function hydrateListboxImageExplorer(target: HTMLElement): void {
  /** Mark the node only after the published composition attaches. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same initial selection as the server tree. */
  function renderExample(): JSX.Element {
    const tree = renderImageExplorerTree(components);
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
