import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Portal, Select } from '../dist/index.js';
import { renderSelectHydrationTree } from './select-hydration-tree';

/** Attach the published browser Select API to the shared server tree. */
export function hydrateSelectExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches its reactive tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the exact JSX used by the server renderer. */
  function renderExample(): JSX.Element {
    const tree = renderSelectHydrationTree({ Portal, Select });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
