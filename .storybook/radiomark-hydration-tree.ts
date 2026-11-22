import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Radiomark as RadiomarkExport } from '../src';

export interface RadiomarkHydrationComponents {
  Radiomark: typeof RadiomarkExport;
}

/** Build the same reactive Radiomark tree for server and browser. */
export function renderRadiomarkHydrationTree({
  Radiomark,
}: RadiomarkHydrationComponents): JSX.Element {
  const [checked, setChecked] = createSignal(false);

  /** Toggle the checked dot after hydration without replacing its span. */
  function toggleRadiomark(): void {
    setChecked(!checked());
  }

  return [
    createComponent(Radiomark, {
      id: 'hydrated-radiomark',
      /** Follow the current visual state after the browser attaches. */
      get checked() {
        return checked();
      },
      /** Change the CSS size on the retained native node. */
      get size() {
        return checked() ? ('lg' as const) : ('xs' as const);
      },
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'radiomark-hydration-toggle',
      type: 'button',
      onClick: toggleRadiomark,
      children: 'Change Radiomark',
    }),
  ];
}
