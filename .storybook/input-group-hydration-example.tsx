import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Input, InputGroup } from '../src';
import { renderInputGroupHydrationTree } from './input-group-hydration-tree';

/** Attach the grouped client tree to the published server nodes. */
export function hydrateInputGroupExample(target: HTMLElement): void {
  /** Mark hydration after the client attaches to existing markup. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the grouped field under Solid's hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderInputGroupHydrationTree({ Input, InputGroup });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
