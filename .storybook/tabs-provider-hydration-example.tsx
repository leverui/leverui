import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  TabsContent,
  TabsContentGroup,
  TabsList,
  TabsRootProvider,
  TabsTrigger,
  useTabs,
} from '../dist/index.js';
import { renderTabsProviderHydrationTree } from './tabs-provider-hydration-tree';

/** Attach the external-machine Tabs tree to published server nodes. */
export function hydrateTabsProviderExample(target: HTMLElement): void {
  /** Mark hydration after Solid attaches to the original DOM. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same provider and machine order in the browser. */
  function renderExample(): JSX.Element {
    const tree = renderTabsProviderHydrationTree({
      TabsRootProvider,
      TabsList,
      TabsTrigger,
      TabsContentGroup,
      TabsContent,
      useTabs,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
