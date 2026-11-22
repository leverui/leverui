import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Button as ButtonExport, InputElement as ElementExport } from '../src';

export interface InputElementHydrationComponents {
  Button: typeof ButtonExport;
  InputElement: typeof ElementExport;
}

/** Build the same reactive element tree for server and browser rendering. */
export function renderInputElementHydrationTree({
  Button,
  InputElement,
}: InputElementHydrationComponents): JSX.Element {
  const [end, setEnd] = createSignal(false);

  /** Change placement after hydration without replacing the element. */
  function togglePlacement(): void {
    setEnd(!end());
  }

  return [
    createComponent(InputElement, {
      id: 'hydrated-input-element',
      /** Follow the current placement signal. */
      get placement() {
        return end() ? ('end' as const) : ('start' as const);
      },
      children: 'kg',
    }),
    createComponent(Button, {
      id: 'hydrated-input-element-toggle',
      type: 'button' as const,
      onClick: togglePlacement,
      children: 'Toggle placement',
    }),
  ];
}
