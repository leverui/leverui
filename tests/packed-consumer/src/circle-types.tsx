import { Circle, type CircleProps } from '@leverui/components';
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

export type NativeAnchorAccepted = ExpectTrue<
  Assignable<{ as: 'a'; href: string; size: string; children: JSX.Element }, CircleProps<'a'>>
>;
export type ResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ size: { base: string; md: string } }, CircleProps>
>;
export type NativeInputResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ as: 'input'; size: { base: string; md: string } }, CircleProps<'input'>>
>;
export type BooleanSizeRejected = ExpectFalse<Assignable<{ size: boolean }, CircleProps>>;
export type CssObjectRejected = ExpectFalse<
  Assignable<{ css: { background: string } }, CircleProps>
>;
export type RadiusPropRejected = ExpectFalse<Assignable<{ borderRadius: string }, CircleProps>>;
export type WrongAnchorRefRejected = ExpectFalse<
  Assignable<{ as: 'a'; ref: (element: HTMLButtonElement) => void }, CircleProps<'a'>>
>;

/** Receive the selected native anchor through the installed declaration. */
function receiveAnchor(element: HTMLAnchorElement): void {
  element.dataset.circleRef = 'anchor';
}

export const anchor = (
  <Circle as="a" href="/docs" ref={receiveAnchor} size="10">
    Circle docs
  </Circle>
);
