import {
  Link,
  LinkBox,
  LinkOverlay,
  type LinkBoxProps,
  type LinkOverlayProps,
  type LinkProps,
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

export type NativeLinkAccepted = ExpectTrue<Assignable<{ href: string }, LinkProps<'a'>>>;
export type ArticleBoxAccepted = ExpectTrue<Assignable<{ as: 'article' }, LinkBoxProps<'article'>>>;
export type NativeStyleAccepted = ExpectTrue<Assignable<{ style: { color: string } }, LinkProps>>;
export type InvalidVariantRejected = ExpectFalse<Assignable<{ variant: 'ghost' }, LinkProps>>;
export type ObjectCssRejected = ExpectFalse<'css' extends keyof LinkProps ? true : false>;
export type LinkRecipeRejected = ExpectFalse<'recipe' extends keyof LinkProps ? true : false>;
export type LinkStylePropRejected = ExpectFalse<
  'fontWeight' extends keyof LinkProps ? true : false
>;
export type BoxObjectCssRejected = ExpectFalse<'css' extends keyof LinkBoxProps ? true : false>;
export type OverlayObjectCssRejected = ExpectFalse<
  'css' extends keyof LinkOverlayProps ? true : false
>;

/** Compile native links and a stretched card from the installed archive. */
export function PackedLinkTypes(): JSX.Element {
  return (
    <LinkBox as="article" class="typed-card">
      <LinkOverlay href="/article">Article</LinkOverlay>
      <Link href="/author" variant={{ base: 'plain', md: 'underline' }}>
        Author
      </Link>
    </LinkBox>
  );
}
