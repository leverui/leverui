import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Grid as GridExport, GridItem as GridItemExport } from '../src';

export interface GridHydrationComponents {
  Grid: typeof GridExport;
  GridItem: typeof GridItemExport;
}

/** Build one reactive Grid tree for published SSR and browser hydration. */
export function renderGridHydrationTree(components: GridHydrationComponents): JSX.Element {
  const [wide, setWide] = createSignal(false);

  /** Change tracks and item span without replacing the hydrated nodes. */
  function toggleTracks(): void {
    setWide(!wide());
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Preserve sibling order between server and browser renders. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hydrated-grid-toggle',
          onClick: toggleTracks,
          children: 'Change tracks',
        }),
        createComponent(components.Grid, {
          id: 'hydrated-grid',
          /** Read the current track count after hydration. */
          get templateColumns() {
            return wide() ? '40px 40px' : '40px';
          },
          /** Keep the item in its original grid owner. */
          get children() {
            return createComponent(components.GridItem, {
              id: 'hydrated-grid-item',
              /** Read the matching item span. */
              get colSpan() {
                return wide() ? 2 : 1;
              },
              /** Retain the server child during reactive updates. */
              get children() {
                return createComponent(Dynamic, {
                  component: 'span',
                  id: 'hydrated-grid-child',
                  children: 'Hydrated grid',
                });
              },
            });
          },
        }),
      ];
    },
  });
}
