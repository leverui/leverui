import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Group as GroupExport } from '../src';

export interface GroupHydrationComponents {
  Group: typeof GroupExport;
}

/** Build the same live Group tree for published SSR and browser hydration. */
export function renderGroupHydrationTree(components: GroupHydrationComponents): JSX.Element {
  const [vertical, setVertical] = createSignal(false);
  const [skipMiddle, setSkipMiddle] = createSignal(false);

  /** Change orientation and skip status without replacing mounted children. */
  function toggleGroup(): void {
    setVertical(!vertical());
    setSkipMiddle(!skipMiddle());
  }

  return createComponent(Dynamic, {
    component: 'section',
    /** Keep child order stable between server and browser renders. */
    get children() {
      return [
        createComponent(Dynamic, {
          component: 'button',
          id: 'hydrated-group-toggle',
          onClick: toggleGroup,
          children: 'Change group',
        }),
        createComponent(components.Group, {
          id: 'hydrated-group',
          attached: true,
          /** Read the current orientation after hydration. */
          get orientation() {
            return vertical() ? 'vertical' : 'horizontal';
          },
          /** Retain the server children as their group position changes. */
          get children() {
            return [
              createComponent(Dynamic, {
                component: 'button',
                id: 'hydrated-group-first',
                children: 'First',
              }),
              createComponent(Dynamic, {
                component: 'button',
                id: 'hydrated-group-middle',
                /** Exclude the middle native child after the toggle. */
                get 'data-leverui-group-skip'() {
                  return skipMiddle() ? '' : undefined;
                },
                children: 'Middle',
              }),
              createComponent(Dynamic, {
                component: 'button',
                id: 'hydrated-group-last',
                children: 'Last',
              }),
            ];
          },
        }),
      ];
    },
  });
}
