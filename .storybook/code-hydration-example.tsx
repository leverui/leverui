import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Code } from '../dist/index.js';
import { renderCodeHydrationTree } from './code-hydration-tree';

/** Attach Code behavior to its existing server-rendered markup. */
export function hydrateCodeExample(target: HTMLElement): void {
  /** Mark the host after Solid has hydrated the Code tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the shared Code tree within the hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderCodeHydrationTree({ Code });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
