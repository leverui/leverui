import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  TreeViewBranchControl,
  TreeViewItem,
  TreeViewNode,
  TreeViewRoot,
  TreeViewTree,
  createTreeCollection,
} from '../dist/index.js';
import { renderTreeViewHydrationTree } from './tree-view-hydration-tree';

/** Attach the published browser Tree View to its server-rendered nodes. */
export function hydrateTreeViewExample(target: HTMLElement): void {
  /** Mark the existing host after Solid attaches its owner. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same tree and collection used by the server entry. */
  function renderExample(): JSX.Element {
    const tree = renderTreeViewHydrationTree({
      TreeViewBranchControl,
      TreeViewItem,
      TreeViewNode,
      TreeViewRoot,
      TreeViewTree,
      createTreeCollection,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
