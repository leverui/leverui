import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { AspectRatio as RatioExport } from '../src';

export interface AspectRatioHydrationComponents {
  AspectRatio: typeof RatioExport;
}

/** Render the same responsive ratio content on server and browser. */
export function renderAspectRatioHydrationTree(
  components: AspectRatioHydrationComponents,
): JSX.Element {
  const [wide, setWide] = createSignal(false);

  /** Change the ratio after the server element has hydrated. */
  function toggleRatio(): void {
    setWide(!wide());
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Preserve the server's sibling order. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hydrated-ratio-toggle',
          onClick: toggleRatio,
          children: 'Change ratio',
        }),
        createComponent(components.AspectRatio, {
          id: 'hydrated-ratio',
          style: { width: '240px' },
          /** Keep the live ratio value on the mounted root. */
          get ratio() {
            return wide() ? 16 / 9 : 1;
          },
          /** Render one native child without an extra wrapper. */
          get children() {
            return createComponent(Dynamic, {
              component: 'div',
              id: 'hydrated-ratio-child',
              children: 'Hydrated content',
            });
          },
        }),
      ];
    },
  });
}
