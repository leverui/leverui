import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { RadioGroup } from '../dist/index.js';
import { renderRadioGroupHydrationTree } from './radio-group-hydration-tree';

/** Attach published browser Radio Group machines to server markup. */
export function hydrateRadioGroupExample(target: HTMLElement): void {
  /** Mark the root after Solid attaches the client tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same JSX tree before hydration. */
  function renderExample(): JSX.Element {
    const tree = renderRadioGroupHydrationTree({ RadioGroup });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
