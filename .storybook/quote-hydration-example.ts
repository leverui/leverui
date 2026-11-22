import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Quote } from '../dist/index.js';
import { renderQuoteHydrationTree } from './quote-hydration-tree';

/** Attach the published browser Quote to matching server markup. */
export function hydrateQuoteExample(target: HTMLElement): void {
  /** Mark the moment the client tree has attached. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same native quotation under the browser hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderQuoteHydrationTree({ Quote });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
