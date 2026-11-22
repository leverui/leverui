import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { EmptyState as EmptyStateExport } from '../src';

export interface EmptyStateHydrationComponents {
  EmptyState: typeof EmptyStateExport;
}

/** Build one stateful compound tree for both server and browser rendering. */
export function renderEmptyStateHydrationTree({
  EmptyState,
}: EmptyStateHydrationComponents): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Switch the mounted root from small to large authored CSS styling. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return [
    createComponent(EmptyState.Root, {
      id: 'hydrated-empty-state',
      /** Follow the current size without replacing the native root. */
      get size() {
        return large() ? ('lg' as const) : ('sm' as const);
      },
      /** Construct parts only after their root context exists. */
      get children() {
        return createComponent(EmptyState.Content, {
          /** Keep the heading and description in the hydrated tree. */
          get children() {
            return [
              createComponent(EmptyState.Title, { children: 'No items' }),
              createComponent(EmptyState.Description, { children: 'Add one.' }),
            ];
          },
        });
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'empty-state-hydration-toggle',
      type: 'button',
      onClick: toggleSize,
      children: 'Toggle size',
    }),
  ];
}
