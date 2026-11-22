import { createComponent, merge } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Button as ButtonExport, Toggle as ToggleExport, ToggleRootProps } from '../src';

type GetToggleChildProps = Parameters<NonNullable<ToggleRootProps['asChild']>>[0];

export type ToggleHydrationComponents = {
  Button: typeof ButtonExport;
  Toggle: typeof ToggleExport;
};

/** Render the same Toggle markup on the server and in the browser. */
export function renderToggleHydrationTree({
  Button,
  Toggle,
}: ToggleHydrationComponents): JSX.Element {
  return [
    createComponent(Toggle.Root, {
      id: 'hydrated-toggle',
      defaultPressed: false,
      'aria-label': 'Hydrated Bold',
      /** Create the native root's conditional content. */
      get children() {
        return createComponent(Toggle.Indicator, { fallback: 'Off', children: 'On' });
      },
    }),
    createComponent(Toggle.Root, {
      id: 'hydrated-button-toggle',
      'aria-label': 'Hydrated Styled Bold',
      /** Forward the primitive state to the styled consumer child. */
      asChild: (getProps: GetToggleChildProps) =>
        createComponent(
          Button,
          merge(getProps(), {
            variant: 'subtle' as const,
            /** Keep the indicator in the same Solid owner on both sides. */
            get children() {
              return createComponent(Toggle.Indicator, {
                fallback: 'Styled off',
                children: 'Styled on',
              });
            },
          }),
        ),
    }),
  ];
}
