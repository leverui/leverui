import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Span as SpanExport } from '../src';

export interface SpanCssHydrationComponents {
  Span: typeof SpanExport;
}

/** Render the same CSS-class-driven Span tree on server and browser. */
export function renderSpanCssHydrationTree({ Span }: SpanCssHydrationComponents): JSX.Element {
  const [alternate, setAlternate] = createSignal(false);

  /** Update the consumer class while preserving the native element. */
  function toggleClass(): void {
    setAlternate(!alternate());
  }

  return [
    createComponent(Span, {
      id: 'hydrated-css-span',
      /** Select consumer CSS without generating a component rule. */
      get class() {
        return alternate() ? 'span-alternate' : 'span-base';
      },
      children: 'Styled with consumer CSS',
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'span-css-toggle',
      type: 'button',
      onClick: toggleClass,
      children: 'Toggle span class',
    }),
  ];
}
