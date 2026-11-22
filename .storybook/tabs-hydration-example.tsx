import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from '../dist/index.js';
import { renderTabsHydrationTree } from './tabs-hydration-tree';

/** Attach the browser Tabs tree to the published server nodes. */
export function hydrateTabsExample(target: HTMLElement): void {
  /** Mark the point when Solid finishes attaching to the server tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Create the same tree while Solid's hydration context is active. */
  function renderExample(): JSX.Element {
    const tree = renderTabsHydrationTree({
      TabsRoot,
      TabsList,
      TabsTrigger,
      TabsContent,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
