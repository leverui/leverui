import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { SplitterPanel, SplitterResizeTrigger, SplitterRoot } from '../src';
import { renderSplitterHydrationTree } from './splitter-hydration-tree';

/** Attach browser Splitter behavior to the published server nodes. */
export function hydrateSplitterExample(target: HTMLElement): void {
  /** Mark the host once Solid has attached to the existing nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Render the matching tree inside the browser hydration context. */
  function renderExample(): JSX.Element {
    const tree = renderSplitterHydrationTree({
      SplitterRoot,
      SplitterPanel,
      SplitterResizeTrigger,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
