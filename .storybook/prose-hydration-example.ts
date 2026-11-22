import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Prose } from '../dist/index.js';
import { renderProseHydrationTree } from './prose-hydration-tree';

/** Attach the public browser Prose implementation to matching server markup. */
export function hydrateProseExample(target: HTMLElement): void {
  /** Mark the point at which the client owner is mounted. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same semantic tree inside the hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderProseHydrationTree({ Prose });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
