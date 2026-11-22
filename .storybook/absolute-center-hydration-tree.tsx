import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { AbsoluteCenter as CenterExport } from '../src';

export interface AbsoluteCenterHydrationComponents {
  AbsoluteCenter: typeof CenterExport;
}

/** Share one provider-free centered tree between server and browser. */
export function renderAbsoluteCenterHydrationTree(
  components: AbsoluteCenterHydrationComponents,
): JSX.Element {
  const [horizontal, setHorizontal] = createSignal(false);

  /** Change the centered axis after the server node has hydrated. */
  function toggleAxis(): void {
    setHorizontal(!horizontal());
  }

  return createComponent(Dynamic, {
    component: 'section',
    id: 'hydrated-center-parent',
    style: { position: 'relative', width: '240px', height: '160px' },
    /** Preserve child order from the server tree. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hydrated-axis-toggle',
          onClick: toggleAxis,
          children: 'Change center axis',
        }),
        createComponent(components.AbsoluteCenter, {
          id: 'hydrated-center',
          style: { width: '60px', height: '40px' },
          /** Track the current axis without replacing this element. */
          get axis() {
            return horizontal() ? 'horizontal' : 'both';
          },
          children: 'Hydrated center',
        }),
      ];
    },
  });
}
