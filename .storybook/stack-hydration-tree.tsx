import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Stack as StackExport, StackSeparator as SeparatorExport } from '../src';

export interface StackHydrationComponents {
  Stack: typeof StackExport;
  StackSeparator: typeof SeparatorExport;
}

/** Build the same reactive Stack tree for published SSR and browser hydration. */
export function renderStackHydrationTree(components: StackHydrationComponents): JSX.Element {
  const [horizontal, setHorizontal] = createSignal(false);

  /** Change direction and gap after the server nodes have been attached. */
  function toggleDirection(): void {
    setHorizontal(!horizontal());
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Preserve native siblings in server and browser output. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hydrated-stack-toggle',
          onClick: toggleDirection,
          children: 'Change direction',
        }),
        createComponent(components.Stack, {
          id: 'hydrated-stack',
          separator: components.StackSeparator,
          /** Follow the selected flex axis reactively. */
          get direction() {
            return horizontal() ? 'row' : 'column';
          },
          /** Update separator spacing with the direction. */
          get gap() {
            return horizontal() ? '16px' : '8px';
          },
          /** Reuse both server-rendered child elements. */
          get children() {
            return [
              createComponent(Dynamic, {
                component: 'span',
                id: 'hydrated-stack-first',
                children: 'First',
              }),
              createComponent(Dynamic, {
                component: 'span',
                id: 'hydrated-stack-second',
                children: 'Second',
              }),
            ];
          },
        }),
      ];
    },
  });
}
