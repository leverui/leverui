import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Bleed as BleedExport } from '../src';

export interface BleedHydrationComponents {
  Bleed: typeof BleedExport;
}

/** Render one logical-margin update from the same server and client tree. */
export function renderBleedHydrationTree(components: BleedHydrationComponents): JSX.Element {
  const [wide, setWide] = createSignal(false);

  /** Update logical margins after the server element has hydrated. */
  function toggleBleed(): void {
    setWide(!wide());
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Preserve sibling order between server output and client attachment. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hydrated-bleed-toggle',
          onClick: toggleBleed,
          children: 'Change spacing',
        }),
        createComponent(components.Bleed, {
          id: 'hydrated-bleed',
          inline: '2',
          /** Follow the signal while preserving the native element. */
          get block() {
            return wide() ? '6' : '2';
          },
          /** Render one child whose identity must survive hydration. */
          get children() {
            return createComponent(Dynamic, {
              component: 'span',
              id: 'hydrated-bleed-child',
              children: 'Hydrated bleed',
            });
          },
        }),
      ];
    },
  });
}
