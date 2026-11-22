import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Combobox, Field, TagsInput, useFilter, useListCollection } from '../dist/index.js';
import { renderTagsInputGuideHydrationTree } from './tags-input-guide-hydration-tree';

/** Attach the published browser components to the server-rendered guide. */
export function hydrateTagsInputGuideExample(target: HTMLElement): void {
  /** Expose the point when Solid attaches the existing server nodes. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Reuse exactly the server's guide composition tree. */
  function renderExample(): JSX.Element {
    const tree = renderTagsInputGuideHydrationTree({
      Combobox,
      Field,
      TagsInput,
      useFilter,
      useListCollection,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
