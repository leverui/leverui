import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Code as CodeExport } from '../src';

export interface CodeHydrationComponents {
  Code: typeof CodeExport;
}

/** Build the same reactive Code tree for server rendering and hydration. */
export function renderCodeHydrationTree({ Code }: CodeHydrationComponents): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change Code's authored size after the browser hydrates it. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return [
    createComponent(Code, {
      id: 'hydrated-code',
      variant: 'solid' as const,
      /** Keep the selected size bound to the current Solid signal. */
      get size() {
        return large() ? ('lg' as const) : ('xs' as const);
      },
      children: 'npm run build',
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'code-hydration-toggle',
      type: 'button',
      onClick: toggleSize,
      children: 'Toggle size',
    }),
  ];
}
