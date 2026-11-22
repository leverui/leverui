import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Wrap as WrapExport, WrapItem as WrapItemExport } from '../src';

export interface WrapHydrationComponents {
  Wrap: typeof WrapExport;
  WrapItem: typeof WrapItemExport;
}

/** Build one reactive Wrap tree for published SSR and browser hydration. */
export function renderWrapHydrationTree(components: WrapHydrationComponents): JSX.Element {
  const [expanded, setExpanded] = createSignal(false);

  /** Change the spacing and item alignment after hydration. */
  function toggleLayout(): void {
    setExpanded(!expanded());
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Preserve the server and browser sibling order. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hydrated-wrap-toggle',
          onClick: toggleLayout,
          children: 'Change layout',
        }),
        createComponent(components.Wrap, {
          id: 'hydrated-wrap',
          /** Read the current Solid signal for the spacing token. */
          get gap() {
            return expanded() ? '4' : '2';
          },
          /** Keep a stable item while its flex styles change. */
          get children() {
            return createComponent(components.WrapItem, {
              id: 'hydrated-wrap-item',
              /** Follow the same signal through Solid's native style prop. */
              get style() {
                return { 'align-items': expanded() ? 'center' : 'flex-start' };
              },
              /** Preserve the native child through the update. */
              get children() {
                return createComponent(Dynamic, {
                  component: 'span',
                  id: 'hydrated-wrap-child',
                  children: 'Wrap child',
                });
              },
            });
          },
        }),
      ];
    },
  });
}
