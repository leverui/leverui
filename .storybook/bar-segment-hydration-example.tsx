import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { BarSegment, useChart } from '../dist/index.js';
import { renderBarSegmentHydrationTree } from './bar-segment-hydration-tree';

/** Attach the published Bar Segment browser entry to server markup. */
export function hydrateBarSegmentExample(target: HTMLElement): void {
  /** Mark the host after Solid attaches its owner. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same chart and data under the browser owner. */
  function renderExample(): JSX.Element {
    const tree = renderBarSegmentHydrationTree({ BarSegment, useChart });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
