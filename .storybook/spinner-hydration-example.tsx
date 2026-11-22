import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Spinner, SpinnerPropsProvider } from '../dist/index.js';
import { renderSpinnerHydrationTree } from './spinner-hydration-tree';

/** Hydrate the Spinner fixture while preserving its server-rendered span. */
export function hydrateSpinnerExample(target: HTMLElement): void {
  /** Mark the host only once Solid attaches its reactive tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the Spinner provider tree within the hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderSpinnerHydrationTree({ Spinner, SpinnerPropsProvider });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
