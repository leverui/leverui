import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  BlockquoteCaption as CaptionExport,
  BlockquoteContent as ContentExport,
  BlockquoteRoot as RootExport,
} from '../src';

export interface BlockquoteHydrationComponents {
  BlockquoteRoot: typeof RootExport;
  BlockquoteContent: typeof ContentExport;
  BlockquoteCaption: typeof CaptionExport;
}

/** Build the same reactive Blockquote tree for server and browser. */
export function renderBlockquoteHydrationTree({
  BlockquoteRoot,
  BlockquoteContent,
  BlockquoteCaption,
}: BlockquoteHydrationComponents): JSX.Element {
  const [centered, setCentered] = createSignal(false);

  /** Change the root alignment without replacing its server rendered node. */
  function toggleAlignment(): void {
    setCentered(!centered());
  }

  return [
    createComponent(BlockquoteRoot, {
      as: 'figure' as const,
      id: 'hydrated-blockquote',
      variant: 'solid' as const,
      /** Read the current alignment in the root's tracked attributes. */
      get justify() {
        return centered() ? 'center' : 'start';
      },
      /** Keep the quote and attribution in their semantic elements. */
      get children() {
        return [
          createComponent(BlockquoteContent, { children: 'A quote' }),
          createComponent(BlockquoteCaption, { children: 'A writer' }),
        ];
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'blockquote-hydration-toggle',
      type: 'button',
      onClick: toggleAlignment,
      children: 'Toggle alignment',
    }),
  ];
}
