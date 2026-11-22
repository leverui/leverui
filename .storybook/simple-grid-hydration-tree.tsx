import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { SimpleGrid as GridExport } from '../src';

export interface SimpleGridHydrationComponents {
  SimpleGrid: typeof GridExport;
}

/** Build one SimpleGrid tree for published SSR and browser hydration. */
export function renderSimpleGridHydrationTree(
  components: SimpleGridHydrationComponents,
): JSX.Element {
  const [wide, setWide] = createSignal(false);

  /** Update the count and minimum width after hydration. */
  function toggleTracks(): void {
    setWide(!wide());
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Keep server and browser sibling order stable. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hydrated-simple-grid-toggle',
          onClick: toggleTracks,
          children: 'Change tracks',
        }),
        createComponent(components.SimpleGrid, {
          id: 'hydrated-simple-grid',
          style: { width: '300px' },
          /** Switch from fixed columns to minimum-width auto-fit. */
          get columns() {
            return wide() ? 1 : 2;
          },
          /** Keep the width selection reactive after hydration. */
          get minChildWidth() {
            return wide() ? '24' : undefined;
          },
          /** Retain the original native child during CSS changes. */
          get children() {
            return [
              createComponent(Dynamic, {
                component: 'span',
                id: 'hydrated-simple-grid-child',
                children: 'Hydrated SimpleGrid',
              }),
              createComponent(Dynamic, { component: 'span', children: 'Second' }),
              createComponent(Dynamic, { component: 'span', children: 'Third' }),
            ];
          },
        }),
      ];
    },
  });
}
