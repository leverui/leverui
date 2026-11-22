import { Spacer, type SpacerProps } from '@leverui/components';
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

export type NativeButtonAccepted = ExpectTrue<
  Assignable<{ as: 'button'; type: 'button'; children: JSX.Element }, SpacerProps<'button'>>
>;
export type ResponsiveFlexAccepted = ExpectTrue<
  Assignable<{ flex: { base: 1; md: 2 } }, SpacerProps<'div'>>
>;
export type CssObjectRejected = ExpectFalse<Assignable<{ css: { flex: 2 } }, SpacerProps<'div'>>>;
export type GeneralStylePropRejected = ExpectFalse<
  Assignable<{ padding: '4' }, SpacerProps<'div'>>
>;
export type WrongButtonRefRejected = ExpectFalse<
  Assignable<{ as: 'button'; ref: (element: HTMLAnchorElement) => void }, SpacerProps<'button'>>
>;

/** Receive the selected native button from the installed declaration. */
function receiveButton(element: HTMLButtonElement): void {
  element.dataset.spacerRef = 'button';
}

export const nativeSpacer = (
  <Spacer as="button" type="button" ref={receiveButton} aria-label="Typed spacer" />
);
