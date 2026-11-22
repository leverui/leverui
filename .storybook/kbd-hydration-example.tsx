import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Kbd, KbdPropsProvider } from '../dist/index.js';
import { renderKbdHydrationTree } from './kbd-hydration-tree';

/** Hydrate published Kbd components over their server-rendered JSX. */
export function hydrateKbdExample(target: HTMLElement): void {
  /** Signal when the browser has attached to the existing Kbd elements. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree inside the browser hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderKbdHydrationTree({ Kbd, KbdPropsProvider });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
