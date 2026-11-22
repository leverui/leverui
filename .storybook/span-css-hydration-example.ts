import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Span } from '../dist/index.js';
import { renderSpanCssHydrationTree } from './span-css-hydration-tree';

/** Attach the installed Span to authored server markup. */
export function hydrateSpanCssExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches its server nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Rebuild the matching tree within the browser owner. */
  function renderExample(): JSX.Element {
    const tree = renderSpanCssHydrationTree({ Span });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
