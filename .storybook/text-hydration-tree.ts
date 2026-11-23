import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Text, TextPropsProvider } from '../src';

type TextHydrationParts = {
  Text: typeof Text;
  TextPropsProvider: typeof TextPropsProvider;
};

/** Render the same provider-scoped Text tree on server and browser. */
export function renderTextHydrationTree(parts: TextHydrationParts): JSX.Element {
  return createComponent(parts.TextPropsProvider, {
    value: { style: { color: 'var(--lui-colors-blue-500)' } },
    /** Render typography through a consumer CSS class. */
    get children() {
      return createComponent(parts.Text, {
        id: 'hydrated-text',
        class: 'text-hydration-responsive',
        children: 'Hydrated typography',
      });
    },
  });
}
