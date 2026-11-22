import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  TimelineConnector,
  TimelineContent,
  TimelineIndicator,
  TimelineItem,
  TimelineRoot,
  TimelineRootPropsProvider,
  TimelineSeparator,
  TimelineTitle,
} from '../dist/index.js';
import { renderTimelineHydrationTree } from './timeline-hydration-tree';

/** Attach published browser Timeline parts to matching server markup. */
export function hydrateTimelineExample(target: HTMLElement): void {
  /** Mark successful attachment on the hydration host. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same Timeline tree beneath the hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderTimelineHydrationTree({
      TimelineRootPropsProvider,
      TimelineRoot,
      TimelineItem,
      TimelineConnector,
      TimelineSeparator,
      TimelineIndicator,
      TimelineContent,
      TimelineTitle,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
