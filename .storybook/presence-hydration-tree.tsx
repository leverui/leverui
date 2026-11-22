import { createComponent, createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Presence as PresenceExport } from '../src';

type PresenceHydrationComponents = {
  Presence: typeof PresenceExport;
};

export interface PresenceHydrationOptions {
  initialPresent: boolean;
  lazyMount?: boolean;
}

/** Share a controlled presence tree between published SSR and hydration. */
export function renderPresenceHydrationTree(
  { Presence }: PresenceHydrationComponents,
  options: PresenceHydrationOptions,
): JSX.Element {
  const [present, setPresent] = createSignal(options.initialPresent);

  /** Change the same presence node after the server element hydrates. */
  function togglePresent(): void {
    setPresent(!present());
  }

  /** Keep the server and browser element order identical. */
  function renderTree(): JSX.Element {
    return createComponent(Dynamic, {
      component: 'section',
      'data-testid': 'presence-hydration-tree',
      /** Create one trigger and the controlled presence node. */
      get children() {
        return [
          createComponent(Dynamic, {
            component: 'button',
            type: 'button',
            'data-testid': 'presence-hydration-toggle',
            onClick: togglePresent,
            children: 'Toggle presence',
          }),
          createComponent(Presence, {
            /** Follow the browser signal after hydration. */
            get present() {
              return present();
            },
            skipAnimationOnMount: true,
            lazyMount: options.lazyMount,
            style: { padding: 'var(--leverui-spacing-4)' },
            'data-testid': 'presence-hydrated-content',
            children: 'Hydrated presence',
          }),
        ];
      },
    });
  }

  return renderTree();
}
