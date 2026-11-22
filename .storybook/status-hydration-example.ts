import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Status, StatusPropsProvider } from '../dist/index.js';
import { renderStatusHydrationTree } from './status-hydration-tree';

/** Attach the published browser Status to matching server markup. */
export function hydrateStatusExample(target: HTMLElement): void {
  /** Mark the host after client attachment completes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Mount the same reactive Status tree used by the server entry. */
  function renderExample(): JSX.Element {
    const tree = renderStatusHydrationTree({ Status, StatusPropsProvider });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
