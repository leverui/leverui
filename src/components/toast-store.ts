import * as toast from '@zag-js/toast';
import { type JSX } from '@solidjs/web';
import { instrumentToastPauseCalls } from './toast-pause-calls';

export interface CreateToasterProps extends Partial<toast.StoreProps> {
  placement: toast.Placement;
}

export type CreateToasterReturn<T = JSX.Element> = toast.Store<T>;
export type ToastOptions<T = JSX.Element> = toast.Options<T>;
export type ToastPromiseOptions<T = unknown> = toast.PromiseOptions<T, JSX.Element>;
export type ToastStoreProps = toast.StoreProps;
export type ToastStatusChangeDetails = toast.StatusChangeDetails;

/** Create a primitive compatible toast store through Zag's public store API. */
export function createToaster<T = JSX.Element>(props: CreateToasterProps): CreateToasterReturn<T> {
  return instrumentToastPauseCalls(toast.createStore<T>(props));
}

/** Let Lever UI own page-idle pauses while preserving the consumer's store policy. */
export function disableMachinePageIdle<T>(store: CreateToasterReturn<T>): CreateToasterReturn<T> {
  const observed = instrumentToastPauseCalls(store);
  return { ...observed, attrs: { ...observed.attrs, pauseOnPageIdle: false } };
}
