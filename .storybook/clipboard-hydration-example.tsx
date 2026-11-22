import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Clipboard } from '../dist/index.js';
import { renderClipboardHydrationTree } from './clipboard-hydration-tree';

/** Attach the published Clipboard browser bundle to its server markup. */
export function hydrateClipboardExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches the existing nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the exact server tree before attaching machine handlers. */
  function renderExample(): JSX.Element {
    const tree = renderClipboardHydrationTree({ Clipboard });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
