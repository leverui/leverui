import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Separator as SeparatorExport } from '../src';

export interface SeparatorHydrationComponents {
  Separator: typeof SeparatorExport;
}

/** Build matching server and browser separator trees with a live orientation. */
export function renderSeparatorHydrationTree({
  Separator,
}: SeparatorHydrationComponents): JSX.Element {
  const [vertical, setVertical] = createSignal(false);

  /** Switch semantic orientation after hydration without remounting the span. */
  function toggleOrientation(): void {
    setVertical(!vertical());
  }

  return [
    createComponent(Separator, {
      id: 'hydrated-separator',
      style: { height: '24px' },
      /** Follow the current client orientation. */
      get orientation() {
        return vertical() ? 'vertical' : 'horizontal';
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      type: 'button',
      id: 'separator-hydration-toggle',
      onClick: toggleOrientation,
      children: 'Toggle orientation',
    }),
  ];
}
