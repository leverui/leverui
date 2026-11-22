import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Bleed } from '../dist/index.js';
import { renderBleedHydrationTree } from './bleed-hydration-tree';

/** Hydrate the published Bleed tree without replacing its native elements. */
export function hydrateBleedExample(target: HTMLElement): void {
  /** Mark completed attachment for the browser assertion. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same tree with browser package exports. */
  function renderExample(): JSX.Element {
    const tree = renderBleedHydrationTree({ Bleed });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
