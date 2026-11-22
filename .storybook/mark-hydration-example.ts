import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Mark, MarkPropsProvider } from '../dist/index.js';
import { renderMarkHydrationTree } from './mark-hydration-tree';

/** Hydrate published Mark components over published server markup. */
export function hydrateMarkExample(target: HTMLElement): void {
  /** Signal when Solid has attached to the existing native marks. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the provider tree inside the browser hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderMarkHydrationTree({ Mark, MarkPropsProvider });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
