import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { DateInput } from '../dist/index.js';
import { renderDateInputHydrationTree } from './date-input-hydration-tree';

/** Attach the published browser DateInput to its server-rendered tree. */
export function hydrateDateInputExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches date-machine handlers. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree for Solid's hydration walk. */
  function renderExample(): JSX.Element {
    const tree = renderDateInputHydrationTree({ DateInput });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
