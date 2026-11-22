import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Presence } from '../src';
import {
  renderPresenceHydrationTree,
  type PresenceHydrationOptions,
} from './presence-hydration-tree';

/** Hydrate the published controlled Presence tree in a browser host. */
export function hydratePresenceExample(
  target: HTMLElement,
  options: PresenceHydrationOptions,
): void {
  /** Mark the first hydration pass after original nodes are matched. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree before mount callbacks run. */
  function renderExample(): JSX.Element {
    const tree = renderPresenceHydrationTree({ Presence }, options);
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
