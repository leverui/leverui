import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { PinInput } from '../src';
import { renderPinInputHydrationTree } from './pin-input-hydration-tree';

/** Attach the browser Pin Input machine to published server nodes. */
export function hydratePinInputExample(target: HTMLElement): void {
  /** Signal that Solid mounted the hydrated machine. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the public tree inside Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderPinInputHydrationTree({ PinInput });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
