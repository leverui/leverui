import { onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { hydrate } from '@solidjs/web';
import { Field, Textarea } from '../src';
import { renderTextareaHydrationTree } from './textarea-hydration-tree';

/** Attach the browser Textarea tree to published server markup. */
export function hydrateTextareaExample(target: HTMLElement): void {
  /** Mark completion after Solid connects existing native controls. */
  function markHydrated(): void {
    target.dataset.hydrated = 'true';
  }

  /** Recreate the same Field and selected-element tree during hydration. */
  function renderExample(): JSX.Element {
    const tree = renderTextareaHydrationTree({ Field, Textarea });
    onSettled(markHydrated);
    return tree;
  }

  hydrate(renderExample, target);
}
