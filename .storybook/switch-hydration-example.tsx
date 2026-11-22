import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Switch } from '../dist/index.js';
import { renderSwitchHydrationTree } from './switch-hydration-tree';

/** Attach the published browser Switch API to the shared server tree. */
export function hydrateSwitchExample(target: HTMLElement): void {
  /** Mark the host once Solid attaches its reactive tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same JSX used by the server renderer. */
  function renderExample(): JSX.Element {
    const tree = renderSwitchHydrationTree({ Switch });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
