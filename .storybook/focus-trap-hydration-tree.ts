import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { FocusTrap as TrapExport } from '../src';

export type FocusTrapHydrationComponents = {
  FocusTrap: typeof TrapExport;
};

/** Build identical native traps for published SSR and client hydration. */
export function renderFocusTrapHydrationTree(
  { FocusTrap }: FocusTrapHydrationComponents,
  initialActive = false,
): JSX.Element {
  const [active, setActive] = createSignal(initialActive);

  /** Activate the existing trap after a user presses its launcher. */
  function openTrap(): void {
    setActive(true);
  }

  /** Deactivate the trap without replacing its native element. */
  function closeTrap(): void {
    setActive(false);
  }

  return [
    createComponent(Dynamic, {
      component: 'button',
      'data-testid': 'hydrated-focus-launcher',
      onClick: openTrap,
      children: 'Open hydrated trap',
    }),
    createComponent(FocusTrap, {
      'data-testid': 'hydrated-focus-root',
      style: { padding: '17px' },
      /** Follow the user's activation after hydration. */
      get disabled() {
        return !active();
      },
      /** Keep both focusable descendants inside the trapped node. */
      get children() {
        return [
          createComponent(Dynamic, {
            component: 'input',
            'aria-label': 'Hydrated focus input',
            'data-autofocus': '',
          }),
          createComponent(Dynamic, {
            component: 'button',
            onClick: closeTrap,
            children: 'Close hydrated trap',
          }),
        ];
      },
    }),
  ];
}
