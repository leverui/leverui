import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { NumberInput } from '../src';
import { renderNumberInputHydrationTree } from './number-input-hydration-tree';

/** Attach Number Input's browser machine to published server nodes. */
export function hydrateNumberInputExample(target: HTMLElement): void {
  /** Signal that Solid mounted the hydrated machine. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the public server tree within Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderNumberInputHydrationTree({ NumberInput });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
