import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Sticky as StickyExport } from '../src';

export interface StickyHydrationComponents {
  Sticky: typeof StickyExport;
}

/** Build one reactive Sticky tree for published SSR and browser hydration. */
export function renderStickyHydrationTree(components: StickyHydrationComponents): JSX.Element {
  const [shifted, setShifted] = createSignal(false);

  /** Change the sticky offset after hydration attaches. */
  function toggleOffset(): void {
    setShifted(!shifted());
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Preserve server and browser sibling order. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hydrated-sticky-toggle',
          onClick: toggleOffset,
          children: 'Shift sticky',
        }),
        createComponent(components.Sticky, {
          id: 'hydrated-sticky',
          /** Keep the native top override reactive after hydration. */
          get style() {
            return { top: shifted() ? '16px' : '0px' };
          },
          /** Keep this native child through the offset change. */
          get children() {
            return createComponent(Dynamic, {
              component: 'span',
              id: 'hydrated-sticky-child',
              children: 'Sticky child',
            });
          },
        }),
      ];
    },
  });
}
