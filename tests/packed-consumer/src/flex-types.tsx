import { Flex, type FlexProps } from '@leverui/components';
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
  Assignable<{ as: 'a'; href: string; inline: boolean; children: JSX.Element }, FlexProps<'a'>>
>;
export type ResponsiveDirectionAccepted = ExpectTrue<
  Assignable<{ direction: { base: 'row'; md: 'column' } }, FlexProps>
>;
export type TokenBasisAccepted = ExpectTrue<Assignable<{ basis: '10' }, FlexProps>>;
export type TextInlineRejected = ExpectFalse<Assignable<{ inline: string }, FlexProps>>;
export type CssObjectRejected = ExpectFalse<'css' extends keyof FlexProps ? true : false>;
export type GapPropRejected = ExpectFalse<'gap' extends keyof FlexProps ? true : false>;
export type NativeStyleAccepted = ExpectTrue<Assignable<{ style: { gap: string } }, FlexProps>>;
export type WrongAnchorRefRejected = ExpectFalse<
  Assignable<{ as: 'a'; ref: (element: HTMLButtonElement) => void }, FlexProps<'a'>>
>;

/** Receive the selected native anchor through the installed declaration. */
function receiveAnchor(element: HTMLAnchorElement): void {
  element.dataset.flexRef = 'anchor';
}

export const anchor = (
  <Flex as="a" href="/docs" ref={receiveAnchor} direction="column">
    Flex docs
  </Flex>
);
