import {
  Kbd,
  KbdPropsProvider,
  type KbdProps,
  type KbdPropsProviderProps,
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
type ProviderDefaults = Exclude<KbdPropsProviderProps['value'], (...args: never[]) => unknown>;

export type KbdRaisedAccepted = ExpectTrue<Assignable<{ variant: 'raised' }, KbdProps>>;
export type KbdInvalidSizeRejected = ExpectFalse<Assignable<{ size: 'xl' }, KbdProps>>;
export type KbdInvalidVariantRejected = ExpectFalse<Assignable<{ variant: 'solid' }, KbdProps>>;
export type KbdCssObjectRejected = ExpectFalse<'css' extends keyof KbdProps ? true : false>;
export type KbdRecipeRejected = ExpectFalse<'recipe' extends keyof KbdProps ? true : false>;
export type KbdClassNameAccepted = ExpectTrue<Assignable<{ className: string }, KbdProps>>;
export type KbdResponsiveAccepted = ExpectTrue<
  Assignable<{ size: { base: 'sm'; md: 'lg' }; variant: ['raised', null, 'plain'] }, KbdProps>
>;
export type KbdProviderClassAccepted = ExpectTrue<Assignable<{ class: string }, ProviderDefaults>>;
export type KbdProviderRefRejected = ExpectFalse<
  'ref' extends keyof ProviderDefaults ? true : false
>;
export type KbdChildRefAccepted = ExpectTrue<
  Assignable<{ asChild: () => JSX.Element; ref: (element: HTMLElement) => void }, KbdProps>
>;

/** Capture a selected native span through the published ref type. */
function captureSpan(element: HTMLSpanElement): void {
  element.dataset.kbdRef = 'span';
}

/** Compile Kbd's finite choices, provider defaults, and selected tag types. */
export function typedKbd(): JSX.Element {
  return (
    <KbdPropsProvider value={{ size: 'sm', variant: 'outline' }}>
      <Kbd as="span" ref={captureSpan} colorPalette="blue">
        Typed key
      </Kbd>
    </KbdPropsProvider>
  );
}
