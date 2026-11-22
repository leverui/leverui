import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { ClientOnly as ClientOnlyExport } from '../src';

type ClientOnlyHydrationComponents = {
  ClientOnly: typeof ClientOnlyExport;
};

/** Build the same deferred content for published SSR and browser hydration. */
export function renderClientOnlyHydrationTree({
  ClientOnly,
}: ClientOnlyHydrationComponents): JSX.Element {
  /** Read browser state only after the ClientOnly mounting boundary. */
  function renderBrowserContent(): JSX.Element {
    return createComponent(Dynamic, {
      component: 'output',
      'data-testid': 'hydrated-client-content',
      /** Read the browser location when deferred content is rendered. */
      get children() {
        return window.location.pathname;
      },
    });
  }

  /** Reveal a second child without a server fallback. */
  function renderWithoutFallback(): JSX.Element {
    return createComponent(Dynamic, {
      component: 'span',
      'data-testid': 'hydrated-no-fallback',
      children: 'Mounted only',
    });
  }

  return createComponent(Dynamic, {
    component: 'div',
    'data-testid': 'client-only-tree',
    /** Construct both ClientOnly boundaries in stable hydration order. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'span',
          'data-testid': 'client-only-stable',
          children: 'Stable sibling',
        }),
        createComponent(ClientOnly, {
          /** Keep the fallback in server markup until mounting. */
          get fallback() {
            return createComponent(Dynamic, {
              component: 'span',
              'data-testid': 'hydrated-fallback',
              children: 'Loading client content',
            });
          },
          children: renderBrowserContent,
        }),
        createComponent(ClientOnly, { children: renderWithoutFallback }),
      ];
    },
  });
}
