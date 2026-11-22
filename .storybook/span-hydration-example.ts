import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Span } from '../dist/index.js';
import { renderSpanHydrationTree } from './span-hydration-tree';

/** Attach the published browser Span to matching server markup. */
export function hydrateSpanExample(target: HTMLElement): void {
  /** Mark the completed client attachment on its host. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same inline content without a runtime styling wrapper. */
  function renderExample(): JSX.Element {
    const tree = renderSpanHydrationTree({ Span });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
