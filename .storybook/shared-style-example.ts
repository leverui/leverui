import { createComponent, createSignal, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Box } from '../src';

/** Show's element-children form, which renders its branch in Show's own scope. */
type ShowBranchProps = { when: boolean; children: JSX.Element };

type SharedStyleParts = {
  Box: typeof Box;
};

/** Render two siblings that share one authored rule and a removal control. */
export function renderSharedStyleExample(parts: SharedStyleParts): JSX.Element {
  const [showFirst, setShowFirst] = createSignal(true);

  /** Remove the first sibling while retaining the second. */
  function removeFirst(): void {
    setShowFirst(false);
  }

  return [
    createComponent<ShowBranchProps>(Show, {
      /** Keep the first Box live until the control is pressed. */
      get when() {
        return showFirst();
      },
      /** Render the first Box only while the signal is true. */
      get children() {
        return createComponent(parts.Box, {
          id: 'first-shared',
          class: 'shared-padding',
          children: 'First',
        });
      },
    }),
    createComponent(parts.Box, {
      id: 'second-shared',
      class: 'shared-padding',
      children: 'Second',
    }),
    createComponent(Dynamic, {
      component: 'button',
      id: 'remove-first',
      type: 'button',
      onClick: removeFirst,
      children: 'Remove first',
    }),
  ];
}
