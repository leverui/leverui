import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { SkipNavContent, SkipNavLink } from '../dist/index.js';
import { renderSkipNavHydrationTree } from './skip-nav-hydration-tree';

/** Attach published browser behavior to server-rendered Skip Nav markup. */
export function hydrateSkipNavExample(target: HTMLElement): void {
  /** Signal that the browser has attached to the existing tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the published server tree with browser exports. */
  function renderExample(): JSX.Element {
    const tree = renderSkipNavHydrationTree({ SkipNavContent, SkipNavLink });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
