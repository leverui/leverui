import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Progress as ProgressExport } from '../src';

export interface ProgressHydrationComponents {
  Progress: typeof ProgressExport;
}

/** Build one provider-free Progress tree for server and browser rendering. */
export function renderProgressHydrationTree({
  Progress,
}: ProgressHydrationComponents): JSX.Element {
  const [advanced, setAdvanced] = createSignal(false);

  /** Change value and size on the hydrated machine. */
  function toggleProgress(): void {
    setAdvanced(!advanced());
  }

  return [
    createComponent(Progress.Root, {
      id: 'hydrated-progress',
      /** Follow the current controlled value. */
      get value() {
        return advanced() ? 75 : 25;
      },
      /** Follow the CSS size without replacing the native root. */
      get size() {
        return advanced() ? ('lg' as const) : ('sm' as const);
      },
      /** Construct parts beneath the primitive's machine context. */
      get children() {
        return [
          createComponent(Progress.ValueText, { id: 'hydrated-progress-value' }),
          createComponent(Progress.Track, {
            id: 'hydrated-progress-track',
            /** Keep the range inside the accessible track. */
            get children() {
              return createComponent(Progress.Range, { id: 'hydrated-progress-range' });
            },
          }),
        ];
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'progress-hydration-toggle',
      type: 'button',
      onClick: toggleProgress,
      children: 'Change progress',
    }),
  ];
}
