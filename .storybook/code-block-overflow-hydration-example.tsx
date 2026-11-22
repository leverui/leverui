import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { CodeBlock, createHighlightJsAdapter } from '../dist/index.js';
import { renderOverflowHydrationTree } from './code-block-overflow-hydration-tree';

/** Hydrate the published browser Code Block over its server-rendered markup. */
export function hydrateOverflowExample(target: HTMLElement): void {
  /** Signal that Solid has attached the long-source controls. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Rebuild the same component tree from the published browser entry. */
  function renderExample(): JSX.Element {
    const tree = renderOverflowHydrationTree({ CodeBlock, createHighlightJsAdapter });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
