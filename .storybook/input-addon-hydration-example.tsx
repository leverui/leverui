import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Button, InputAddon } from '../src';
import { renderInputAddonHydrationTree } from './input-addon-hydration-tree';

/** Attach the browser addon tree to published server markup. */
export function hydrateInputAddonExample(target: HTMLElement): void {
  /** Mark completion after Solid attaches to the server tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server component tree inside the hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderInputAddonHydrationTree({ Button, InputAddon });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
