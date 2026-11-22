import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Prose as ProseExport } from '../src/components/prose';

export interface ProseHydrationComponents {
  Prose: typeof ProseExport;
}

/** Build the same Prose tree on the server and in the browser. */
export function renderProseHydrationTree({ Prose }: ProseHydrationComponents): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Switch the typography scale without replacing the article. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return [
    createComponent(Prose, {
      as: 'article' as const,
      id: 'hydrated-prose',
      /** Preserve Solid's tracked prop access across hydration. */
      get size() {
        return large() ? 'lg' : 'md';
      },
      innerHTML: '<h2>Hydrated heading</h2><p>Hydrated body.</p>',
    }),
    createComponent(Dynamic, {
      component: 'button',
      type: 'button',
      id: 'prose-size-toggle',
      onClick: toggleSize,
      children: 'Toggle size',
    }),
  ];
}
