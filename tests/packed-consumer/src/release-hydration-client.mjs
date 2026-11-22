import '@leverui/components/styles.css';
import { onSettled } from 'solid-js';
import { hydrate } from '@solidjs/web';
import { renderReleaseHydrationTree } from './release-hydration-tree.mjs';

const root = document.getElementById('app');
if (!root) throw new Error('The release hydration fixture needs an #app element.');

/** Mark completion only after Solid has attached the client owner. */
function markHydrated() {
  root.dataset.hydrated = 'true';
}

/** Recreate the server tree under Solid's hydration context. */
function hydrateReleaseTree() {
  // Build the tree first: `onSettled` takes a hydration key, so calling it
  // before the tree would shift every client key away from the server's.
  const tree = renderReleaseHydrationTree();
  onSettled(markHydrated);
  return tree;
}

hydrate(hydrateReleaseTree, root);
