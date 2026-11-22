import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Portal as PortalExport } from '../src';

/** Share one custom-container tree between published SSR and browser hydration. */
export function renderPortalHydrationTree(Portal: typeof PortalExport): JSX.Element {
  const [container, setContainer] = createSignal<HTMLDivElement>();

  /** Capture the destination when its native node becomes available. */
  function captureContainer(element: HTMLDivElement): void {
    setContainer(element);
  }

  /** Construct content that starts inline in the server markup. */
  function renderPortalContent(): JSX.Element {
    return createComponent(Dynamic, {
      component: 'span',
      'data-testid': 'portal-hydration-content',
      children: 'Custom portal content',
    });
  }

  return createComponent(Dynamic, {
    component: 'section',
    'data-testid': 'portal-hydration-tree',
    /** Keep the portal before its destination to exercise a late ref. */
    get children() {
      return [
        createComponent(Portal, {
          container,
          /** Recreate the same child during server render and hydration. */
          get children() {
            return renderPortalContent();
          },
        }),
        createComponent(Dynamic, {
          component: 'div',
          'data-testid': 'portal-hydration-container',
          ref: captureContainer,
        }),
      ];
    },
  });
}
