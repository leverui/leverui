import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Box, Button } from '../src';

type CssScopeParts = {
  Box: typeof Box;
  Button: typeof Button;
};

/** Render a local CSS theme that changes without remounting its children. */
export function renderReactiveCssScopeExample(parts: CssScopeParts): JSX.Element {
  const [scope, setScope] = createSignal<'alpha' | 'beta'>('alpha');

  /** Change the wrapper class while preserving its native descendants. */
  function toggleScope(): void {
    setScope(scope() === 'alpha' ? 'beta' : 'alpha');
  }

  return createComponent(parts.Box, {
    id: 'css-scope-root',
    /** Select the current theme's public CSS variable overrides. */
    get class() {
      return `reactive-scope-${scope()}`;
    },
    /** Keep both samples mounted across class changes. */
    get children() {
      return [
        createComponent(parts.Box, {
          id: 'css-scope-token',
          class: 'reactive-scope-token',
          children: 'Token sample',
        }),
        createComponent(parts.Button, {
          id: 'css-scope-button',
          onClick: toggleScope,
          children: 'Switch theme',
        }),
      ];
    },
  });
}
