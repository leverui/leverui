import { onSettled } from 'solid-js';
import { hydrate } from '@solidjs/web';
import { Command } from '../dist/index.js';
import { renderCommandHydrationTree } from './command-hydration-tree.mjs';

/** Attach live Command behavior to the published server markup. */
export function hydrateCommandExample(target) {
  /** Signal that Solid attached the client machine. */
  function markHydrated() {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the exact server tree before hydration. */
  function renderExample() {
    const tree = renderCommandHydrationTree({ Command });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
