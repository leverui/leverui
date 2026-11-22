import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Stat, StatPropsProvider } from '../dist/index.js';
import { renderStatHydrationTree } from './stat-hydration-tree';

/** Attach the published browser Stat to matching server markup. */
export function hydrateStatExample(target: HTMLElement): void {
  /** Mark the host after client attachment completes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Mount the same reactive Stat tree used by the server entry. */
  function renderExample(): JSX.Element {
    const tree = renderStatHydrationTree({ Stat, StatPropsProvider });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
