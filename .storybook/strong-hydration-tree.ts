import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Strong as StrongExport } from '../src';

export interface StrongHydrationComponents {
  Strong: typeof StrongExport;
}

/** Build matching server and browser Strong trees with one reactive style. */
export function renderStrongHydrationTree({ Strong }: StrongHydrationComponents): JSX.Element {
  const [plain, setPlain] = createSignal(false);

  /** Change consumer weight after hydration without replacing Strong. */
  function toggleWeight(): void {
    setPlain(!plain());
  }

  return [
    createComponent(Strong, {
      id: 'hydrated-strong',
      title: 'Hydrated importance',
      /** Apply a changing consumer class without replacing Strong. */
      get class() {
        return plain() ? 'strong-hydrated-plain' : undefined;
      },
      children: 'Hydrated importance',
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'strong-hydration-toggle',
      type: 'button',
      onClick: toggleWeight,
      children: 'Toggle weight',
    }),
  ];
}
