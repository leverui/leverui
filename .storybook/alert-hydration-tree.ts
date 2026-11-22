import { createComponent, createSignal, merge } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Dynamic } from '@solidjs/web';
import type { Alert as AlertExport, AlertPropsProvider as PropsProviderExport } from '../src';
import type { GetChildProps } from '../src/styled-system/child-props';

export interface AlertHydrationComponents {
  Alert: typeof AlertExport;
  AlertPropsProvider: typeof PropsProviderExport;
}

/** Build matching server and browser trees with a reactive Alert provider. */
export function renderAlertHydrationTree({
  Alert,
  AlertPropsProvider,
}: AlertHydrationComponents): JSX.Element {
  const [success, setSuccess] = createSignal(false);

  /** Update inherited status and size after client attachment. */
  function toggleAlert(): void {
    setSuccess(!success());
  }

  return createComponent(AlertPropsProvider, {
    /** Follow status and size signal changes in descendant reads. */
    value: () => ({ status: success() ? 'success' : 'info', size: success() ? 'lg' : 'sm' }),
    /** Match root and button order across server and browser. */
    get children() {
      return [
        createComponent(Alert.Root, {
          id: 'hydrated-alert',
          role: 'status' as const,
          /** Hydrate the root on a caller-owned native section. */
          asChild: (getProps: GetChildProps) =>
            createComponent(Dynamic, merge({ component: 'section' }, getProps())),
          /** Construct parts after the root context is active. */
          get children() {
            return [
              createComponent(Alert.Indicator, { id: 'hydrated-alert-indicator' }),
              createComponent(Alert.Content, {
                /** Construct the title inside the content part. */
                get children() {
                  return createComponent(Alert.Title, {
                    /** Attach the Alert title hook to a caller-owned heading. */
                    asChild: (getProps: GetChildProps) =>
                      createComponent(Dynamic, {
                        component: 'h3',
                        ...getProps(),
                        children: 'Processing',
                      }),
                  });
                },
              }),
            ];
          },
        }),
        createComponent(Dynamic, {
          component: 'button',
          id: 'alert-hydration-toggle',
          type: 'button',
          onClick: toggleAlert,
          children: 'Change alert',
        }),
      ];
    },
  });
}
