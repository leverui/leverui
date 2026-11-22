import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Text } from '../dist/index.js';
import { renderTextCssHydrationTree } from './text-css-hydration-tree';

/** Hydrate the installed Text components against authored CSS. */
export function hydrateTextCssExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches its server nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Rebuild the server's clipping tree under the browser owner. */
  function renderExample(): JSX.Element {
    const tree = renderTextCssHydrationTree({ Text });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
