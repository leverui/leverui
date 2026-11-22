import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Quote as QuoteExport } from '../src';

export interface QuoteHydrationComponents {
  Quote: typeof QuoteExport;
}

/** Build matching server and browser quotation trees with a live consumer class. */
export function renderQuoteHydrationTree({ Quote }: QuoteHydrationComponents): JSX.Element {
  const [plain, setPlain] = createSignal(false);

  /** Change the quotation's weight after Solid hydrates the server node. */
  function toggleWeight(): void {
    setPlain(!plain());
  }

  return [
    createComponent(Quote, {
      id: 'hydrated-quote',
      cite: 'https://example.com/hydrated',
      /** Recompute the consumer class without replacing the native quote. */
      get class() {
        return plain() ? 'plain-quote' : undefined;
      },
      children: 'Hydrated quotation',
    }),
    createComponent(Dynamic, {
      component: 'button',
      type: 'button',
      id: 'quote-hydration-toggle',
      onClick: toggleWeight,
      children: 'Toggle weight',
    }),
  ];
}
