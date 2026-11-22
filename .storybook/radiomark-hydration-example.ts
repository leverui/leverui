import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Radiomark } from '../dist/index.js';
import { renderRadiomarkHydrationTree } from './radiomark-hydration-tree';

/** Attach the published browser Radiomark to its server markup. */
export function hydrateRadiomarkExample(target: HTMLElement): void {
  /** Signal that the client tree has attached. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same stateful tree through the browser entry. */
  function renderExample(): JSX.Element {
    const tree = renderRadiomarkHydrationTree({ Radiomark });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
