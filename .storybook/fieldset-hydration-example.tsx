import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Button, Field, Fieldset, Input } from '../src';
import { renderFieldsetHydrationTree } from './fieldset-hydration-tree';

/** Attach the public Fieldset tree to its published server markup. */
export function hydrateFieldsetExample(target: HTMLElement): void {
  /** Expose completion after the primitive has connected its client owner. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree within Solid's hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderFieldsetHydrationTree({ Button, Field, Fieldset, Input });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
