import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Float as FloatExport } from '../src/components/float';

export interface FloatHydrationComponents {
  Float: typeof FloatExport;
}

/** Build one reactive Float tree for server rendering and hydration. */
export function renderFloatHydrationTree(components: FloatHydrationComponents): JSX.Element {
  const [bottom, setBottom] = createSignal(false);

  /** Move the hydrated Float to the opposite corner. */
  function togglePlacement(): void {
    setBottom(!bottom());
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Preserve sibling order across server and client renders. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hydrated-float-toggle',
          onClick: togglePlacement,
          children: 'Move float',
        }),
        createComponent(Dynamic, {
          component: 'div',
          id: 'hydrated-float-parent',
          style: { position: 'relative', width: '200px', height: '120px' },
          /** Keep the floated child under its positioned ancestor. */
          get children() {
            return createComponent(components.Float, {
              id: 'hydrated-float',
              style: { width: '20px', height: '20px' },
              /** Follow the live placement signal after hydration. */
              get placement() {
                return bottom() ? 'bottom-end' : 'top-start';
              },
              /** Keep the child element mounted during position changes. */
              get children() {
                return createComponent(Dynamic, {
                  component: 'span',
                  id: 'hydrated-float-child',
                  children: 'Hydrated float',
                });
              },
            });
          },
        }),
      ];
    },
  });
}
