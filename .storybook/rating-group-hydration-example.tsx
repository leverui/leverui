import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { RatingGroup } from '../dist/index.js';
import { renderRatingGroupHydrationTree } from './rating-group-hydration-tree';

/** Attach published browser Rating Group machines to server markup. */
export function hydrateRatingGroupExample(target: HTMLElement): void {
  /** Mark the root after Solid attaches the client tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server JSX tree for hydration. */
  function renderExample(): JSX.Element {
    const tree = renderRatingGroupHydrationTree({ RatingGroup });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
