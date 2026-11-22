import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Span as SpanExport } from '../src';

export interface SpanHydrationComponents {
  Span: typeof SpanExport;
}

/** Build matching server and browser trees with one native style prop. */
export function renderSpanHydrationTree({ Span }: SpanHydrationComponents): JSX.Element {
  const [alternate, setAlternate] = createSignal(false);

  /** Change native color after hydration without replacing the span. */
  function toggleColor(): void {
    setAlternate(!alternate());
  }

  return [
    createComponent(Span, {
      id: 'hydrated-span',
      children: 'Hydrated inline text',
      /** Read the current native style during client updates. */
      get style() {
        return {
          color: alternate() ? 'var(--leverui-colors-blue-500)' : 'var(--leverui-colors-red-500)',
        };
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      type: 'button',
      id: 'span-hydration-toggle',
      onClick: toggleColor,
      children: 'Toggle color',
    }),
  ];
}
