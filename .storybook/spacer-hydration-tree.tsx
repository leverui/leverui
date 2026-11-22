import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Spacer as SpacerExport } from '../src';

export interface SpacerHydrationComponents {
  Spacer: typeof SpacerExport;
}

/** Build one Spacer tree for published SSR and browser hydration. */
export function renderSpacerHydrationTree(components: SpacerHydrationComponents): JSX.Element {
  const [expanded, setExpanded] = createSignal(false);

  /** Change the Spacer's flex weight after hydration. */
  function toggleExpansion(): void {
    setExpanded(!expanded());
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Keep server and browser sibling order stable. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hydrated-spacer-toggle',
          onClick: toggleExpansion,
          children: 'Expand space',
        }),
        createComponent(Dynamic, {
          component: 'div',
          id: 'hydrated-spacer-row',
          style: 'display:flex;width:240px;height:30px',
          /** Render two fixed siblings around the flexible Spacer. */
          get children() {
            return [
              createComponent(Dynamic, {
                component: 'span',
                style: 'width:40px',
                children: 'First',
              }),
              createComponent(components.Spacer, {
                id: 'hydrated-spacer',
                /** Keep the style read reactive after hydration. */
                get flex() {
                  return expanded() ? 2 : 1;
                },
                /** Keep the native child mounted during style changes. */
                get children() {
                  return createComponent(Dynamic, {
                    component: 'span',
                    id: 'hydrated-spacer-child',
                    children: 'Spacer child',
                  });
                },
              }),
              createComponent(Dynamic, {
                component: 'span',
                style: 'width:40px',
                children: 'Last',
              }),
            ];
          },
        }),
      ];
    },
  });
}
