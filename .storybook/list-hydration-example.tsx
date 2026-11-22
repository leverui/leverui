import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { ListIndicator } from '../dist/components/list-indicator.js';
import { ListItem } from '../dist/components/list-item.js';
import { ListRootPropsProvider } from '../dist/components/list-props.js';
import { ListRoot } from '../dist/components/list-root.js';
import { renderListHydrationTree } from './list-hydration-tree';

/** Attach published List components to their existing server nodes. */
export function hydrateListExample(target: HTMLElement): void {
  /** Mark the target after Solid mounts its hydrated tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the server tree under a hydration owner. */
  function renderExample(): JSX.Element {
    const tree = renderListHydrationTree({
      ListRoot,
      ListRootPropsProvider,
      ListItem,
      ListIndicator,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
