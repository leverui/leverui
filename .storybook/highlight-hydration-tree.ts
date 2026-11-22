import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Highlight as HighlightExport } from '../src';

export interface HighlightHydrationComponents {
  Highlight: typeof HighlightExport;
}

/** Build the same matched text on the server and in the browser. */
export function renderHighlightHydrationTree({
  Highlight,
}: HighlightHydrationComponents): JSX.Element {
  const [query, setQuery] = createSignal('Solid');

  /** Select another match after hydration without changing the source text. */
  function changeQuery(): void {
    setQuery('fast');
  }

  return [
    createComponent(Highlight, {
      /** Feed the hook the current query inside a tracked getter. */
      get query() {
        return query();
      },
      children: 'Solid is great and Solid is fast',
      markStyle: { 'font-weight': 'bold' },
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'highlight-hydration-toggle',
      type: 'button',
      onClick: changeQuery,
      children: 'Change match',
    }),
  ];
}
