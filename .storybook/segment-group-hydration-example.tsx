import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { SegmentGroup } from '../dist/index.js';
import { renderSegmentGroupHydrationTree } from './segment-group-hydration-tree';

/** Attach published browser Segment Group machines to server markup. */
export function hydrateSegmentGroupExample(target: HTMLElement): void {
  /** Mark the root after Solid attaches the client tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the matching Solid tree before hydration. */
  function renderExample(): JSX.Element {
    const tree = renderSegmentGroupHydrationTree({ SegmentGroup });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
