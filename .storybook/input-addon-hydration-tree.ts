import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Button as ButtonExport, InputAddon as InputAddonExport } from '../src';

export interface InputAddonHydrationComponents {
  Button: typeof ButtonExport;
  InputAddon: typeof InputAddonExport;
}

/** Build the same addon and variant toggle for server and browser rendering. */
export function renderInputAddonHydrationTree({
  Button,
  InputAddon,
}: InputAddonHydrationComponents): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change the hydrated addon size without replacing its element. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return [
    createComponent(InputAddon, {
      id: 'hydrated-input-addon',
      variant: 'outline' as const,
      /** Keep the selected size reactive after hydration. */
      get size() {
        return large() ? ('lg' as const) : ('sm' as const);
      },
      children: 'https://',
    }),
    createComponent(Button, {
      id: 'hydrated-input-addon-toggle',
      type: 'button' as const,
      onClick: toggleSize,
      children: 'Toggle addon size',
    }),
  ];
}
