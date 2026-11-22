import {
  Alert,
  AlertPropsProvider,
  type AlertRootProps,
  type AlertTitleProps,
  type AlertPropsProviderProps,
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
type ProviderDefaults = Exclude<AlertPropsProviderProps['value'], (...args: never[]) => unknown>;

export type AlertStatusAccepted = ExpectTrue<Assignable<{ status: 'warning' }, AlertRootProps>>;
export type InvalidAlertStatusRejected = ExpectFalse<
  Assignable<{ status: 'pending' }, AlertRootProps>
>;
export type ResponsiveAlertSizeAccepted = ExpectTrue<
  Assignable<{ size: { base: 'sm'; md: 'lg' } }, AlertRootProps>
>;
export type OptionalAlertUnstyledAccepted = ExpectTrue<
  Assignable<{ unstyled: boolean | undefined }, AlertRootProps>
>;
export type AlertCssObjectRejected = ExpectFalse<
  Assignable<{ css: { color: string } }, AlertRootProps>
>;
export type AlertStylePropRejected = ExpectFalse<Assignable<{ bg: string }, AlertRootProps>>;
export type OptionalProviderUnstyledAccepted = ExpectTrue<
  Assignable<{ unstyled: boolean | undefined }, ProviderDefaults>
>;
export type ProviderRefRejected = ExpectFalse<'ref' extends keyof ProviderDefaults ? true : false>;
export type ButtonTitleRefAccepted = ExpectTrue<
  Assignable<{ as: 'button'; ref: (element: HTMLButtonElement) => void }, AlertTitleProps<'button'>>
>;
export type WrongButtonTitleRefRejected = ExpectFalse<
  Assignable<{ as: 'button'; ref: (element: HTMLDivElement) => void }, AlertTitleProps<'button'>>
>;
export type ChildTitleRefAccepted = ExpectTrue<
  Assignable<
    { asChild: NonNullable<AlertTitleProps['asChild']>; ref: (element: HTMLElement) => void },
    AlertTitleProps
  >
>;

/** Mark the native button passed to a published Alert title ref. */
function markButton(element: HTMLButtonElement): void {
  element.dataset.typedTitle = 'button';
}

/** Compile native and child Alert compositions from installed declarations. */
export function typedAlert(): JSX.Element {
  return (
    <AlertPropsProvider value={{ status: 'success', size: 'sm' }}>
      <Alert.Root as="section" role="status">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title as="button" type="button" ref={markButton}>
            Published title
          </Alert.Title>
          <Alert.Description>Published description</Alert.Description>
          <Alert.Title
            asChild={
              /** Compile the Solid child callback against installed types. */
              (getProps) => (
                <button {...getProps()} type="button">
                  Child title
                </button>
              )
            }
          />
        </Alert.Content>
      </Alert.Root>
    </AlertPropsProvider>
  );
}
