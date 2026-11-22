import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type {
  Spinner as SpinnerExport,
  SpinnerPropsProvider as SpinnerPropsProviderExport,
} from '../src';

type SpinnerHydrationComponents = {
  Spinner: typeof SpinnerExport;
  SpinnerPropsProvider: typeof SpinnerPropsProviderExport;
};

/** Build the same reactive Spinner provider tree on server and client. */
export function renderSpinnerHydrationTree({
  Spinner,
  SpinnerPropsProvider,
}: SpinnerHydrationComponents): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Switch the inherited Spinner size after hydration. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return [
    createComponent(SpinnerPropsProvider, {
      /** Recompute inherited size in the browser's tracked scope. */
      get value() {
        return { size: large() ? ('lg' as const) : ('sm' as const) };
      },
      /** Render the same named indicator on both sides of hydration. */
      get children() {
        return createComponent(Spinner, {
          id: 'hydrated-spinner',
          role: 'status' as const,
          'aria-label': 'Working',
        });
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'spinner-hydration-toggle',
      type: 'button',
      onClick: toggleSize,
      children: 'Toggle size',
    }),
  ];
}
