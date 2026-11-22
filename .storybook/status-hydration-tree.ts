import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Status as StatusExport } from '../src/components/status-exports';
import type { StatusPropsProvider as StatusPropsProviderExport } from '../src/components/status-props';

export interface StatusHydrationComponents {
  Status: typeof StatusExport;
  StatusPropsProvider: typeof StatusPropsProviderExport;
}

/** Build the same reactive Status tree for server and browser entries. */
export function renderStatusHydrationTree({
  Status,
  StatusPropsProvider,
}: StatusHydrationComponents): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change the inherited size and palette without replacing native nodes. */
  function toggleStatus(): void {
    setLarge(!large());
  }

  return createComponent(StatusPropsProvider, {
    /** Read the current size and palette during tracked updates. */
    value: () => ({ size: large() ? 'lg' : 'sm', colorPalette: large() ? 'green' : 'red' }),
    /** Create the root after its variant provider is active. */
    get children() {
      return [
        createComponent(Status.Root, {
          id: 'hydrated-status',
          /** Create the indicator inside the current style context. */
          get children() {
            return [
              createComponent(Status.Indicator, { id: 'hydrated-status-indicator' }),
              'Processing',
            ];
          },
        }),
        createComponent(Dynamic, {
          component: 'button',
          type: 'button',
          id: 'status-hydration-toggle',
          onClick: toggleStatus,
          children: 'Toggle status',
        }),
      ];
    },
  });
}
