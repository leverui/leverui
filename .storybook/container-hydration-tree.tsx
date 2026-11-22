import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Container as ContainerExport } from '../src';

export interface ContainerHydrationComponents {
  Container: typeof ContainerExport;
}

/** Build one reactive Container tree for server rendering and hydration. */
export function renderContainerHydrationTree(
  components: ContainerHydrationComponents,
): JSX.Element {
  const [fluid, setFluid] = createSignal(false);

  /** Change the Container's maximum width after hydration. */
  function toggleFluid(): void {
    setFluid(!fluid());
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Preserve sibling order in server and browser output. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hydrated-container-toggle',
          onClick: toggleFluid,
          children: 'Change fluid',
        }),
        createComponent(components.Container, {
          id: 'hydrated-container',
          /** Follow the signal while retaining the same native root. */
          get fluid() {
            return fluid();
          },
          /** Keep the child in place across appearance changes. */
          get children() {
            return createComponent(Dynamic, {
              component: 'span',
              id: 'hydrated-container-child',
              children: 'Hydrated content',
            });
          },
        }),
      ];
    },
  });
}
