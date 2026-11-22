import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { ScrollArea } from '../dist/index.js';
import { renderScrollAreaHydrationTree } from './scroll-area-hydration-tree';

/** Attach published browser behavior to the server-rendered viewport. */
export function hydrateScrollAreaExample(target: HTMLElement): void {
  /** Signal that Solid has attached the machine and its effects. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same tree used by the server renderer. */
  function renderExample(): JSX.Element {
    const tree = renderScrollAreaHydrationTree({ ScrollArea });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
