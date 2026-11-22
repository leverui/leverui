import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Checkmark } from '../dist/index.js';
import { renderCheckmarkHydrationTree } from './checkmark-hydration-tree';

/** Attach the published client Checkmark to existing server-rendered SVG markup. */
export function hydrateCheckmarkExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches the client tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Build the same Checkmark tree used by the server render. */
  function renderExample(): JSX.Element {
    const tree = renderCheckmarkHydrationTree({ Checkmark });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
