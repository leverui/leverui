import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Strong } from '../dist/index.js';
import { renderStrongHydrationTree } from './strong-hydration-tree';

/** Attach the published browser Strong to matching server markup. */
export function hydrateStrongExample(target: HTMLElement): void {
  /** Mark successful client attachment on the host. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the shared tree beneath the hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderStrongHydrationTree({ Strong });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
