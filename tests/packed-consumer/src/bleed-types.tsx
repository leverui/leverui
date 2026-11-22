import { Bleed, type BleedProps } from '@leverui/components';
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
  Assignable<{ as: 'a'; href: string; inline: string; children: JSX.Element }, BleedProps<'a'>>
>;
export type ResponsiveSpacingAccepted = ExpectTrue<
  Assignable<{ inline: { base: string; md: string } }, BleedProps>
>;
export type ReadonlySpacingAccepted = ExpectTrue<
  Assignable<{ inline: readonly ['2', null, '6'] }, BleedProps>
>;
export type OptionalSpacingAccepted = ExpectTrue<
  Assignable<{ inline: string | undefined }, BleedProps>
>;
export type BooleanSpacingRejected = ExpectFalse<Assignable<{ inline: boolean }, BleedProps>>;
export type NestedSpacingRejected = ExpectFalse<
  Assignable<{ inline: { _hover: string } }, BleedProps>
>;
export type CssObjectRejected = ExpectFalse<
  Assignable<{ css: { marginInline: string } }, BleedProps>
>;
export type GeneralStylePropRejected = ExpectFalse<Assignable<{ bg: string }, BleedProps>>;
export type WrongAnchorRefRejected = ExpectFalse<
  Assignable<{ as: 'a'; ref: (element: HTMLButtonElement) => void }, BleedProps<'a'>>
>;

/** Receive the selected native anchor through the installed declaration. */
function receiveAnchor(element: HTMLAnchorElement): void {
  element.dataset.bleedRef = 'anchor';
}

export const anchor = (
  <Bleed as="a" href="/docs" ref={receiveAnchor} inline="4">
    Bleed docs
  </Bleed>
);
