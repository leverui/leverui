import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { ProgressCircle as ProgressCircleExport } from '../src';

export interface ProgressCircleHydrationComponents {
  ProgressCircle: typeof ProgressCircleExport;
}

/** Build one provider-free Circle tree for server and browser rendering. */
export function renderProgressCircleHydrationTree({
  ProgressCircle,
}: ProgressCircleHydrationComponents): JSX.Element {
  const [advanced, setAdvanced] = createSignal(false);

  /** Change value and size on the hydrated machine. */
  function toggleProgressCircle(): void {
    setAdvanced(!advanced());
  }

  return [
    createComponent(ProgressCircle.Root, {
      id: 'hydrated-progress-circle',
      /** Follow the current controlled value. */
      get value() {
        return advanced() ? 75 : 25;
      },
      /** Follow CSS size without replacing the native root. */
      get size() {
        return advanced() ? ('lg' as const) : ('sm' as const);
      },
      /** Construct parts beneath the primitive's machine context. */
      get children() {
        return [
          createComponent(ProgressCircle.ValueText, { id: 'hydrated-progress-circle-value' }),
          createComponent(ProgressCircle.Circle, {
            id: 'hydrated-progress-circle-svg',
            /** Keep the track and range inside the accessible SVG. */
            get children() {
              return [
                createComponent(ProgressCircle.Track, { id: 'hydrated-progress-circle-track' }),
                createComponent(ProgressCircle.Range, { id: 'hydrated-progress-circle-range' }),
              ];
            },
          }),
        ];
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'progress-circle-hydration-toggle',
      type: 'button',
      onClick: toggleProgressCircle,
      children: 'Change progress circle',
    }),
  ];
}
