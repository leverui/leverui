import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Portal } from '../src';
import { renderPortalHydrationTree } from './portal-hydration-tree';

/** Hydrate the published custom-container portal tree in the browser. */
export function hydratePortalExample(target: HTMLElement): void {
  /** Mark completion of Solid's first hydration pass. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree before Portal runs its mount callback. */
  function renderExample(): JSX.Element {
    const tree = renderPortalHydrationTree(Portal);
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
