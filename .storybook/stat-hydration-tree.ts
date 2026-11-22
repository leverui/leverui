import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Stat as StatExport } from '../src/components/stat-exports';
import type { StatPropsProvider as StatPropsProviderExport } from '../src/components/stat-props';

export interface StatHydrationComponents {
  Stat: typeof StatExport;
  StatPropsProvider: typeof StatPropsProviderExport;
}

/** Build the same reactive Stat tree for published server and browser entries. */
export function renderStatHydrationTree({
  Stat,
  StatPropsProvider,
}: StatHydrationComponents): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change inherited Stat size without replacing its semantic nodes. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return createComponent(StatPropsProvider, {
    /** Read the current group default during tracked client updates. */
    value: () => ({ size: large() ? 'lg' : 'sm' }),
    /** Create the list after its variant provider is active. */
    get children() {
      return [
        createComponent(Stat.Root, {
          id: 'hydrated-stat',
          /** Create semantic parts inside the Stat style context. */
          get children() {
            return [
              createComponent(Stat.Label, { children: 'Visitors' }),
              createComponent(Stat.ValueText, {
                id: 'hydrated-stat-value',
                children: '192.1k',
              }),
            ];
          },
        }),
        createComponent(Dynamic, {
          component: 'button',
          type: 'button',
          id: 'stat-hydration-toggle',
          onClick: toggleSize,
          children: 'Toggle size',
        }),
      ];
    },
  });
}
