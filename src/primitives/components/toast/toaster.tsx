import { splitProps } from '../../utils/split-props';
import { Key, normalizeProps, useMachine } from '@zag-js/solid';
import { mergeProps } from '../../utils/merge-part-props';
import * as toast from '@zag-js/toast';
import { type Accessor, createMemo, createUniqueId } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { useEnvironmentContext, useLocaleContext } from '../../providers/index';
import type { Assign } from '../../types';
import type { HTMLProps } from '../factory';
import type { CreateToasterReturn } from './create-toaster';
import { ToastProvider } from './use-toast-context';

export type ToastOptions = toast.Options<JSX.Element>;

export interface ToasterBaseProps extends Omit<toast.GroupProps, 'id' | 'store'> {
  // A store's payload type is invariant, so the region accepts a store of any payload.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- see above
  toaster: CreateToasterReturn<any>;
  children: (toast: Accessor<ToastOptions>) => JSX.Element;
  /**
   * The human-readable label for the toast region.
   * @default "Notifications"
   */
  label?: string | undefined;
}
export type ToasterProps = Assign<HTMLProps<'div'>, ToasterBaseProps>;

/** Render the Toast er. */
export const Toaster = (props: ToasterProps) => {
  const [toasterProps, rest] = splitProps(props, ['toaster', 'children']);
  const [machineProps, groupAndLocal] = splitProps(rest, ['dir', 'getRootNode']);
  const [groupProps, localProps] = splitProps(groupAndLocal, ['label']);

  const locale = useLocaleContext();
  const env = useEnvironmentContext();

  const service = useMachine(toast.group.machine, () => ({
    store: toasterProps.toaster,
    id: createUniqueId(),
    dir: machineProps.dir ?? locale()?.dir,
    getRootNode: machineProps.getRootNode ?? env()?.getRootNode,
  }));

  const api = createMemo(() => toast.group.connect(service, normalizeProps));
  const toasts = createMemo(() => api().getToasts());

  const mergedProps = mergeProps(() => api().getGroupProps(groupProps), localProps);

  return (
    <div {...mergedProps}>
      <Key each={toasts()} by="id">
        {(toast, index) => (
          <ToastActor value={toast} index={index} parent={service}>
            {(ctx) => toasterProps.children(ctx)}
          </ToastActor>
        )}
      </Key>
    </div>
  );
};

interface ToastActorProps {
  value: Accessor<toast.Options<JSX.Element>>;
  parent: toast.GroupService;
  index: Accessor<number>;
  children: (ctx: Accessor<toast.Options<JSX.Element>>) => JSX.Element;
}

/** Render the Toast actor. */
const ToastActor = (props: ToastActorProps) => {
  const env = useEnvironmentContext();
  const localProps = createMemo(() => ({
    ...props.value(),
    parent: props.parent,
    index: props.index(),
    getRootNode: env().getRootNode,
  }));

  const service = useMachine(toast.machine, localProps);
  const api = createMemo(() => toast.connect(service, normalizeProps));
  return <ToastProvider value={api}>{props.children(props.value)}</ToastProvider>;
};
