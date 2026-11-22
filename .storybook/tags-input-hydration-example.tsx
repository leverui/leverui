import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { TagsInput } from '../dist/index.js';
import { renderTagsInputHydrationTree } from './tags-input-hydration-tree';

/** Attach the published browser Tags Input tree to its server markup. */
export function hydrateTagsInputExample(target: HTMLElement): void {
  /** Mark the host after the client tree attaches. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same JSX tree used by the server renderer. */
  function renderExample(): JSX.Element {
    const tree = renderTagsInputHydrationTree({ TagsInput });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
