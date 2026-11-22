import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Badge as BadgeExport, BadgePropsProvider as BadgePropsProviderExport } from '../src';

export interface BadgeHydrationComponents {
  Badge: typeof BadgeExport;
  BadgePropsProvider: typeof BadgePropsProviderExport;
}

/** Build the same reactive Badge tree on server and browser. */
export function renderBadgeHydrationTree({
  Badge,
  BadgePropsProvider,
}: BadgeHydrationComponents): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Update the inherited Badge size after hydration. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return createComponent(Dynamic, {
    component: 'div',
    /** Keep the Badge provider and native control in one hydration order. */
    get children() {
      return [
        createComponent(BadgePropsProvider, {
          /** Recompute inherited Badge size within Solid's tracked scope. */
          get value() {
            return {
              size: large() ? ('lg' as const) : ('xs' as const),
              variant: 'solid' as const,
              colorPalette: 'blue' as const,
            };
          },
          /** Render the server and browser Badge with identical content. */
          get children() {
            return createComponent(Badge, { id: 'hydrated-badge', children: 'Active' });
          },
        }),
        createComponent(Dynamic, {
          component: 'button',
          id: 'badge-hydration-toggle',
          onClick: toggleSize,
          children: 'Toggle size',
        }),
      ];
    },
  });
}
