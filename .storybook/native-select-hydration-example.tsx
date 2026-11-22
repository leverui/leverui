import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Button, NativeSelect } from '../src';
import { renderNativeSelectHydrationTree } from './native-select-hydration-tree';

/** Attach the client Native Select to its published server nodes. */
export function hydrateNativeSelectExample(target: HTMLElement): void {
  /** Mark hydration after Solid connects to the existing markup. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the select under Solid's hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderNativeSelectHydrationTree({ Button, NativeSelect });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
