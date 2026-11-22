import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Button, Field, Input } from '../src';
import { renderFieldHydrationTree } from './field-hydration-tree';

/** Attach the public Field tree to its published server markup. */
export function hydrateFieldExample(target: HTMLElement): void {
  /** Expose completion only after the client owner has mounted. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree within Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderFieldHydrationTree({ Button, Field, Input });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
