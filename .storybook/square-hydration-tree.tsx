import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Square as SquareExport } from '../src';

export interface SquareHydrationComponents {
  Square: typeof SquareExport;
}

/** Build one reactive Square tree for server rendering and hydration. */
export function renderSquareHydrationTree(components: SquareHydrationComponents): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change the hydrated Square's size without replacing its content. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Preserve sibling order across server and browser rendering. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hydrated-square-toggle',
          onClick: toggleSize,
          children: 'Change size',
        }),
        createComponent(components.Square, {
          id: 'hydrated-square',
          /** Follow the signal after attachment. */
          get size() {
            return large() ? '12' : '8';
          },
          /** Retain the same centered child during updates. */
          get children() {
            return createComponent(Dynamic, {
              component: 'span',
              id: 'hydrated-square-child',
              children: 'Hydrated square',
            });
          },
        }),
      ];
    },
  });
}
