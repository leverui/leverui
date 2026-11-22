import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Checkmark as CheckmarkExport } from '../src';

export interface CheckmarkHydrationComponents {
  Checkmark: typeof CheckmarkExport;
}

/** Build the same stateful SVG tree for server rendering and browser hydration. */
export function renderCheckmarkHydrationTree({
  Checkmark,
}: CheckmarkHydrationComponents): JSX.Element {
  const [state, setState] = createSignal<'checked' | 'indeterminate' | 'unchecked'>('checked');
  const [disabled, setDisabled] = createSignal(false);

  /** Advance through the three SVG glyph states in place. */
  function cycleState(): void {
    setState(
      state() === 'checked'
        ? 'indeterminate'
        : state() === 'indeterminate'
          ? 'unchecked'
          : 'checked',
    );
  }

  /** Toggle the disabled selector without replacing the SVG. */
  function toggleDisabled(): void {
    setDisabled(!disabled());
  }

  return [
    createComponent(Checkmark, {
      id: 'hydrated-checkmark',
      /** Read the current tick state inside Solid's reactive scope. */
      get checked() {
        return state() === 'checked';
      },
      /** Read the current minus state inside Solid's reactive scope. */
      get indeterminate() {
        return state() === 'indeterminate';
      },
      /** Follow the disabled signal on the mounted SVG. */
      get disabled() {
        return disabled();
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'checkmark-hydration-cycle',
      type: 'button',
      onClick: cycleState,
      children: 'Cycle Checkmark',
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'checkmark-hydration-disabled',
      type: 'button',
      onClick: toggleDisabled,
      children: 'Toggle disabled',
    }),
  ];
}
