import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { BlockquoteCaption, BlockquoteContent, BlockquoteRoot } from '../src';
import { renderBlockquoteHydrationTree } from './blockquote-hydration-tree';

/** Attach browser Blockquote behavior to its server rendered figure. */
export function hydrateBlockquoteExample(target: HTMLElement): void {
  /** Signal that Solid attached to the existing markup. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the shared quote tree inside Solid's hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderBlockquoteHydrationTree({
      BlockquoteRoot,
      BlockquoteContent,
      BlockquoteCaption,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
