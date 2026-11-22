import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Button, InputElement } from '../src';
import { renderInputElementHydrationTree } from './input-element-hydration-tree';

/** Attach the client adornment tree to the published server markup. */
export function hydrateInputElementExample(target: HTMLElement): void {
  /** Mark hydration after Solid attaches to the original tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server component tree in the hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderInputElementHydrationTree({ Button, InputElement });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
