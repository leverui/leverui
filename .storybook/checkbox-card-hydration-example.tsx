import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { CheckboxCard } from '../src';
import { renderCheckboxCardHydrationTree } from './checkbox-card-hydration-tree';

/** Attach Checkbox Card behavior to the published server markup. */
export function hydrateCheckboxCardExample(target: HTMLElement): void {
  /** Mark completion after Solid mounts the hydrated card tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server's component order in the browser. */
  function renderExample(): JSX.Element {
    const tree = renderCheckboxCardHydrationTree({ CheckboxCard });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
