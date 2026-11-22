import { AbsoluteCenter, type AbsoluteCenterProps } from '@leverui/components';
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

export type CssObjectRejected = ExpectFalse<'css' extends keyof AbsoluteCenterProps ? true : false>;
export type WidthStylePropRejected = ExpectFalse<
  'width' extends keyof AbsoluteCenterProps ? true : false
>;
export type NativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { width: string } }, AbsoluteCenterProps>
>;

export type NativeAnchorAccepted = ExpectTrue<
  Assignable<{ as: 'a'; href: string; axis: 'horizontal' }, AbsoluteCenterProps<'a'>>
>;
export type InvalidAxisRejected = ExpectFalse<
  Assignable<{ axis: 'diagonal' }, AbsoluteCenterProps>
>;
export type WrongAnchorRefRejected = ExpectFalse<
  Assignable<{ as: 'a'; ref: (element: HTMLButtonElement) => void }, AbsoluteCenterProps<'a'>>
>;

/** Accept the selected native anchor through the public ref. */
function receiveAnchor(element: HTMLAnchorElement): void {
  element.dataset.centerRef = 'anchor';
}

/** Render a native anchor with installed positioning and ref types. */
export const anchor = (
  <AbsoluteCenter as="a" axis="vertical" href="/docs" ref={receiveAnchor}>
    Docs
  </AbsoluteCenter>
);

/** Supply a selected native child through the Solid renderer contract. */
function renderLink(
  getProps: Parameters<NonNullable<AbsoluteCenterProps['asChild']>>[0],
): JSX.Element {
  return (
    <a {...getProps()} href="/docs">
      Docs
    </a>
  );
}

export const child = <AbsoluteCenter asChild={renderLink} axis="horizontal" />;
