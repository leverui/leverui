import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Center as CenterExport } from '../src';

export interface CenterHydrationComponents {
  Center: typeof CenterExport;
}

/** Build the same reactive Center tree for server rendering and hydration. */
export function renderCenterHydrationTree(components: CenterHydrationComponents): JSX.Element {
  const [inline, setInline] = createSignal(false);

  /** Switch the hydrated element between flex display modes. */
  function toggleInline(): void {
    setInline(!inline());
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Preserve sibling order between server and browser renderers. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hydrated-center-toggle',
          onClick: toggleInline,
          children: 'Change display',
        }),
        createComponent(components.Center, {
          id: 'hydrated-center',
          style: { width: '240px', height: '80px' },
          /** Follow the signal without replacing the native element. */
          get inline() {
            return inline();
          },
          /** Preserve the centered child during hydration and updates. */
          get children() {
            return createComponent(Dynamic, {
              component: 'span',
              id: 'hydrated-center-child',
              children: 'Hydrated center',
            });
          },
        }),
      ];
    },
  });
}
