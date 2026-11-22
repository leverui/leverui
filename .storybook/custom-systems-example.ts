import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Box, Button, Theme } from '../src';

type CssScopeParts = {
  Box: typeof Box;
  Button: typeof Button;
  Theme: typeof Theme;
};

/** Render one local CSS theme with its own colors and button treatment. */
function renderBranch(parts: CssScopeParts, scope: 'alpha' | 'beta'): JSX.Element {
  return createComponent(parts.Theme, {
    class: `css-scope-${scope}`,
    appearance: scope === 'alpha' ? 'light' : 'dark',
    /** Keep the local examples inside their variable and mode scope. */
    get children() {
      return [
        createComponent(parts.Box, {
          id: `${scope}-box`,
          class: 'css-scope-token',
          children: `${scope} token`,
        }),
        createComponent(parts.Box, {
          id: `${scope}-global`,
          class: 'css-scope-global',
          children: `${scope} global style`,
        }),
        createComponent(parts.Button, {
          id: `${scope}-button`,
          colorPalette: 'blue',
          children: `${scope} button`,
        }),
        createComponent(parts.Button, {
          id: `${scope}-default-button`,
          children: `${scope} default palette`,
        }),
        createComponent(parts.Theme, {
          id: `${scope}-nested-theme`,
          appearance: scope === 'alpha' ? 'dark' : 'light',
          /** Let the nested mode select its nearest semantic background. */
          get children() {
            return createComponent(parts.Box, {
              id: `${scope}-nested-bg`,
              class: 'css-scope-background',
              children: 'Nested mode',
            });
          },
        }),
      ];
    },
  });
}

/** Show two CSS-variable themes beside the default token values. */
export function renderCustomSystemsExample(parts: CssScopeParts): JSX.Element {
  return [
    createComponent(parts.Box, {
      id: 'default-box',
      class: 'css-scope-token',
      children: 'Default token',
    }),
    renderBranch(parts, 'alpha'),
    renderBranch(parts, 'beta'),
  ];
}
