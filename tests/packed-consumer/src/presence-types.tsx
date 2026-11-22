import { Presence, type PresenceProps } from '@leverui/components';
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
type ExpectFalse<Value extends false> = Value;

export type WrongAnchorRefRejected = ExpectFalse<
  Assignable<{ as: 'a'; ref: (element: HTMLButtonElement) => void }, PresenceProps<'a'>>
>;
export type CssObjectRejected = ExpectFalse<Assignable<{ css: { color: 'red' } }, PresenceProps>>;
export type StyleShorthandRejected = ExpectFalse<Assignable<{ p: '4' }, PresenceProps>>;

/** Receive the native anchor selected by Presence's `as` prop. */
function receiveAnchor(element: HTMLAnchorElement): void {
  element.dataset.presenceRef = 'anchor';
}

/** Receive the element chosen by Presence's child renderer. */
function receiveChild(element: HTMLElement): void {
  element.dataset.presenceRef = 'child';
}

/** Supply an anchor with native props through the child-renderer contract. */
function renderLink(getProps: Parameters<NonNullable<PresenceProps['asChild']>>[0]): JSX.Element {
  return (
    <a {...getProps()} href="/docs">
      Docs
    </a>
  );
}

export const nativeAnchor = <Presence as="a" href="/docs" ref={receiveAnchor} present />;
export const childAnchor = <Presence asChild={renderLink} ref={receiveChild} present />;
