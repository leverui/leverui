import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Field, Input } from '../src';
import { renderInputHydrationTree } from './input-hydration-tree';

/** Attach the Input tree to published server markup without replacing controls. */
export function hydrateInputExample(target: HTMLElement): void {
  /** Mark hydration completion for the browser assertion. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree inside Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderInputHydrationTree({ Field, Input });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
