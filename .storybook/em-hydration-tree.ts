import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Em as EmExport } from '../src';

export interface EmHydrationComponents {
  Em: typeof EmExport;
}

/** Build one reactive Em tree for published server and browser entries. */
export function renderEmHydrationTree({ Em }: EmHydrationComponents): JSX.Element {
  const [plain, setPlain] = createSignal(false);

  /** Update the emphasis style without replacing the server element. */
  function toggleStyle(): void {
    setPlain(!plain());
  }

  return [
    createComponent(Em, {
      id: 'hydrated-em',
      title: 'Hydrated emphasis',
      /** Apply a changing consumer class to the native element. */
      get class() {
        return plain() ? 'em-hydrated-plain' : undefined;
      },
      children: 'Hydrated emphasis',
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'em-hydration-toggle',
      type: 'button',
      onClick: toggleStyle,
      children: 'Toggle emphasis',
    }),
  ];
}
