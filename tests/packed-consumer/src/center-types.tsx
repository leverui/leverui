import { Center, type CenterProps } from '@leverui/components';
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
  Assignable<{ as: 'a'; href: string; inline: boolean; children: JSX.Element }, CenterProps<'a'>>
>;
export type ResponsiveInlineAccepted = ExpectTrue<
  Assignable<{ inline: { base: boolean; md: boolean } }, CenterProps>
>;
export type TextInlineRejected = ExpectFalse<Assignable<{ inline: string }, CenterProps>>;
export type CssObjectRejected = ExpectFalse<'css' extends keyof CenterProps ? true : false>;
export type WidthPropRejected = ExpectFalse<'width' extends keyof CenterProps ? true : false>;
export type NativeStyleAccepted = ExpectTrue<Assignable<{ style: { width: string } }, CenterProps>>;
export type WrongAnchorRefRejected = ExpectFalse<
  Assignable<{ as: 'a'; ref: (element: HTMLButtonElement) => void }, CenterProps<'a'>>
>;

/** Receive a selected native anchor through the installed declaration. */
function receiveAnchor(element: HTMLAnchorElement): void {
  element.dataset.centerRef = 'anchor';
}

export const anchor = (
  <Center as="a" href="/docs" ref={receiveAnchor} inline>
    Center docs
  </Center>
);
