import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Box, Theme } from '../src';

type ScopeComponents = {
  Box: typeof Box;
  Theme: typeof Theme;
};

/** Build the one dark/light tree used on both sides of hydration. */
export function renderScopedHydrationTree({ Box, Theme }: ScopeComponents): JSX.Element {
  return createComponent(Theme, {
    appearance: 'dark',
    id: 'hydrated-scope',
    /** Supply the outer child and inner scope. */
    get children() {
      return [
        createComponent(Box, {
          id: 'hydrated-scoped-box',
          class: 'scoped-hydration-box',
          children: 'Scoped',
        }),
        createComponent(Theme, {
          appearance: 'light',
          id: 'hydrated-inner-scope',
          /** Supply the inner child. */
          get children() {
            return createComponent(Box, {
              id: 'hydrated-inner-box',
              class: 'scoped-hydration-box',
              children: 'Nested',
            });
          },
        }),
      ];
    },
  });
}
