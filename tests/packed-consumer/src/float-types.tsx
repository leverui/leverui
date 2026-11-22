import { Float, type FloatProps } from '@leverui/components';
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
  Assignable<
    { as: 'a'; href: string; placement: 'top-start'; children: JSX.Element },
    FloatProps<'a'>
  >
>;
export type ResponsivePlacementAccepted = ExpectTrue<
  Assignable<{ placement: { base: 'top-end'; md: 'bottom-start' } }, FloatProps>
>;
export type ResponsiveOffsetAccepted = ExpectTrue<
  Assignable<{ offsetX: { base: '0'; md: '8px' } }, FloatProps>
>;
export type InvalidPlacementRejected = ExpectFalse<Assignable<{ placement: 'center' }, FloatProps>>;
export type CssObjectRejected = ExpectFalse<'css' extends keyof FloatProps ? true : false>;
export type WidthPropRejected = ExpectFalse<'width' extends keyof FloatProps ? true : false>;
export type NativeStyleAccepted = ExpectTrue<Assignable<{ style: { width: string } }, FloatProps>>;
export type WrongAnchorRefRejected = ExpectFalse<
  Assignable<{ as: 'a'; ref: (element: HTMLButtonElement) => void }, FloatProps<'a'>>
>;

/** Receive the native anchor from the installed Float declaration. */
function receiveAnchor(element: HTMLAnchorElement): void {
  element.dataset.floatRef = 'anchor';
}

export const anchor = (
  <Float as="a" href="/docs" ref={receiveAnchor} placement="bottom-start">
    Float docs
  </Float>
);
