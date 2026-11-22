import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Flex as FlexExport } from '../src';

export interface FlexHydrationComponents {
  Flex: typeof FlexExport;
}

/** Build one reactive Flex tree for server rendering and hydration. */
export function renderFlexHydrationTree(components: FlexHydrationComponents): JSX.Element {
  const [column, setColumn] = createSignal(false);

  /** Change the hydrated Flex direction without replacing its children. */
  function toggleDirection(): void {
    setColumn(!column());
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Keep sibling order consistent on server and client. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hydrated-flex-toggle',
          onClick: toggleDirection,
          children: 'Change direction',
        }),
        createComponent(components.Flex, {
          id: 'hydrated-flex',
          /** Read the live signal after hydration. */
          get direction() {
            return column() ? 'column' : 'row';
          },
          /** Retain the same child as styles update. */
          get children() {
            return createComponent(Dynamic, {
              component: 'span',
              id: 'hydrated-flex-child',
              children: 'Hydrated flex',
            });
          },
        }),
      ];
    },
  });
}
