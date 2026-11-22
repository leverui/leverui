import {
  Toast,
  Toaster,
  createToaster,
  type CreateToasterProps,
  type ToastOptions,
  type ToastRootProps,
  type ToastIndicatorProps,
  type ToastStoreProps,
  type ToasterProps,
} from '@leverui/components';
import { type JSX } from '@solidjs/web';

/** Match JSX attribute checks: assignable, with no key outside some member of `To`. */
type NoExcessKeys<From, To> = To extends unknown
  ? [Exclude<keyof From, keyof To>] extends [never]
    ? true
    : never
  : never;
type Assignable<From, To> = [From] extends [To]
  ? [NoExcessKeys<From, To>] extends [never]
    ? false
    : true
  : false;
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;

export type PlacementAccepted = ExpectTrue<
  Assignable<{ placement: 'bottom-end' }, CreateToasterProps>
>;
export type PlacementRequired = ExpectFalse<Assignable<object, CreateToasterProps>>;
export type RootWidthRejected = ExpectFalse<Assignable<{ width: 'sm' }, ToastRootProps>>;
export type RootNativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { width: string } }, ToastRootProps>
>;
export type StoreMaxAccepted = ExpectTrue<Assignable<{ max: 2 }, ToastStoreProps>>;
export type IndicatorSvgRefAccepted = ExpectTrue<
  Assignable<{ ref: (element: SVGSVGElement) => void }, ToastIndicatorProps>
>;

/** Compile the installed Toast namespace, store, options, and native region. */
export function typedToast(): JSX.Element {
  const toaster = createToaster({ placement: 'bottom-end', max: 2 });
  const options: ToastOptions = { title: 'Saved', type: 'success' };
  toaster.create(options);

  const regionProps: ToasterProps = {
    toaster,
    /** Render one installed Toast composition for each store item. */
    children: (item) => (
      <Toast.Root class="consumer-toast">
        <Toast.Indicator />
        <Toast.Title>{item().title}</Toast.Title>
        <Toast.Description>{item().description}</Toast.Description>
        <Toast.ActionTrigger>Undo</Toast.ActionTrigger>
        <Toast.CloseTrigger />
      </Toast.Root>
    ),
  };
  const structuredStore = createToaster<{ message: string }>({ placement: 'top-end' });
  const structuredRegionProps: ToasterProps<{ message: string }> = {
    toaster: structuredStore,
    /** Keep the custom payload type on the child accessor. */
    children: (item) => <Toast.Root>{item().title?.message}</Toast.Root>,
  };
  return (
    <>
      <Toaster {...regionProps} />
      <Toaster {...structuredRegionProps} />
    </>
  );
}
