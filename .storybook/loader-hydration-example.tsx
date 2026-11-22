import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Loader, LoaderOverlay } from '../dist/index.js';
import { renderLoaderHydrationTree } from './loader-hydration-tree';

/** Hydrate the Loader fixture over its published server-rendered markup. */
export function hydrateLoaderExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches its reactive tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same Loader tree in the browser hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderLoaderHydrationTree({ Loader, LoaderOverlay });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
