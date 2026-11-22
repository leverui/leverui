import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import {
  Input,
  Listbox,
  Square,
  VisuallyHidden,
  createGridCollection,
  useFilter,
} from '../dist/index.js';
import { renderListboxEmojiTree } from './listbox-emoji-tree';

/** Attach the published browser package to the server Emoji Grid tree. */
export function hydrateListboxEmojiExample(target: HTMLElement): void {
  /** Mark completion only after Solid attaches the interactive tree. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same collection order and initial state as server rendering. */
  function renderExample(): JSX.Element {
    const tree = renderListboxEmojiTree({
      Input,
      Listbox,
      Square,
      VisuallyHidden,
      createGridCollection,
      useFilter,
    });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
