import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Circle as CircleExport } from '../src';

export interface CircleHydrationComponents {
  Circle: typeof CircleExport;
}

/** Build one reactive Circle tree for both server rendering and hydration. */
export function renderCircleHydrationTree(components: CircleHydrationComponents): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change the hydrated Circle's size without replacing its content. */
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
          id: 'hydrated-circle-toggle',
          onClick: toggleSize,
          children: 'Change size',
        }),
        createComponent(components.Circle, {
          id: 'hydrated-circle',
          /** Follow the signal after attachment. */
          get size() {
            return large() ? '12' : '8';
          },
          /** Retain the same centered child during updates. */
          get children() {
            return createComponent(Dynamic, {
              component: 'span',
              id: 'hydrated-circle-child',
              children: 'Hydrated circle',
            });
          },
        }),
      ];
    },
  });
}
