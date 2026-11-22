import {
  SkipNavContent,
  SkipNavLink,
  type SkipNavContentProps,
  type SkipNavLinkProps,
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

export type SkipLinkIdAccepted = ExpectTrue<Assignable<{ id: string }, SkipNavLinkProps<'a'>>>;
export type MainContentAccepted = ExpectTrue<
  Assignable<{ as: 'main'; id: string }, SkipNavContentProps<'main'>>
>;
export type InvalidTargetRejected = ExpectFalse<Assignable<{ id: number }, SkipNavLinkProps<'a'>>>;
export type LinkObjectCssRejected = ExpectFalse<
  'css' extends keyof SkipNavLinkProps ? true : false
>;
export type LinkRecipeRejected = ExpectFalse<
  'recipe' extends keyof SkipNavLinkProps ? true : false
>;
export type LinkStylePropRejected = ExpectFalse<
  'top' extends keyof SkipNavLinkProps ? true : false
>;
export type ContentObjectCssRejected = ExpectFalse<
  'css' extends keyof SkipNavContentProps ? true : false
>;
export type ContentStylePropRejected = ExpectFalse<
  'padding' extends keyof SkipNavContentProps ? true : false
>;

/** Compile native props and the polymorphic destination from the archive. */
export function PackedSkipNavTypes(): JSX.Element {
  return (
    <>
      <SkipNavLink id="typed-main" aria-label="Skip typed navigation">
        Skip
      </SkipNavLink>
      <SkipNavContent as="main" id="typed-main">
        Typed main content
      </SkipNavContent>
    </>
  );
}
