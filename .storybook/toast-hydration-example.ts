import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Toast, Toaster, createToaster } from '../dist/index.js';
import { renderToastHydrationTree } from './toast-hydration-tree';

/** Attach the published browser Toast region to server markup. */
export function hydrateToastExample(target: HTMLElement): void {
  /** Mark attachment without replacing the server region. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the matching notification tree. */
  function renderExample(): JSX.Element {
    const tree = renderToastHydrationTree({ Toast, Toaster, createToaster });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
