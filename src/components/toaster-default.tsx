import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal } from './portal';
import { Spinner } from './spinner';
import { Stack } from './stack';
import { ToastIndicator } from './toast-indicator';
import {
  ToastActionTrigger,
  ToastCloseTrigger,
  ToastContent,
  ToastDescription,
  ToastTitle,
} from './toast-parts';
import type { ToasterProps } from './toast-props';
import { ToastRoot } from './toast-root';
import { createToaster } from './toast-store';
import { Toaster as ToasterRegion } from './toaster';
import type { ClassValue } from '../utils/class-value';

/** The app-wide store that `<Toaster />` renders; call `toaster.create()` to show a toast. */
export const toaster = createToaster({ placement: 'bottom-end', pauseOnPageIdle: true });

/** Attributes for the ready-made notification region. */
export interface DefaultToasterProps {
  /** Classes for the notification region. */
  class?: ClassValue;
}

/** Render the shared store's notifications with the default toast layout. */
function DefaultToaster(props: DefaultToasterProps): JSX.Element {
  return (
    <Portal>
      <ToasterRegion toaster={toaster} class={['leverui-toaster-default', props.class]}>
        {
          /** Compose one notification from its store item. */
          (item) => (
            <ToastRoot class="leverui-toaster-default__toast">
              {item().type === 'loading' ? (
                <Spinner size="sm" class="leverui-toaster-default__spinner" />
              ) : (
                <ToastIndicator />
              )}
              <ToastContent class="leverui-toaster-default__text">
                <Stack gap="1">
                  {item().title && <ToastTitle>{item().title}</ToastTitle>}
                  {item().description && <ToastDescription>{item().description}</ToastDescription>}
                </Stack>
              </ToastContent>
              {item().action && <ToastActionTrigger>{item().action?.label}</ToastActionTrigger>}
              {item().closable && <ToastCloseTrigger />}
            </ToastRoot>
          )
        }
      </ToasterRegion>
    </Portal>
  );
}

/** Render `<Toaster />` for the shared `toaster`, or pass a store and layout of your own. */
type ToasterComponent = <T = JSX.Element>(
  props: ToasterProps<T> | (DefaultToasterProps & { toaster?: undefined; children?: undefined }),
) => JSX.Element;

/** Choose the ready-made region when no store is given. */
function ToasterEntry(props: ToasterProps | DefaultToasterProps): JSX.Element {
  return (
    <Show
      when={'toaster' in props && props.toaster}
      fallback={<DefaultToaster {...(props as DefaultToasterProps)} />}
    >
      <ToasterRegion {...(props as ToasterProps)} />
    </Show>
  );
}

export const Toaster = ToasterEntry as ToasterComponent;
