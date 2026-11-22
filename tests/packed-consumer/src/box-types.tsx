import { Box, type BoxProps } from '@leverui/components';

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

export type SectionPropsAccepted = ExpectTrue<Assignable<{ as: 'section' }, BoxProps>>;
export type NativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { padding: '4px' } }, BoxProps<'div'>>
>;
export type ObjectCssRejected = ExpectFalse<'css' extends keyof BoxProps<'div'> ? true : false>;
export type SpacingShorthandRejected = ExpectFalse<
  'p' extends keyof BoxProps<'div'> ? true : false
>;
export type AnchorRefWithoutAsRejected = ExpectFalse<
  Assignable<{ ref: (element: HTMLAnchorElement) => void }, BoxProps<'a'>>
>;

/** Accept the actual anchor chosen by Box's `as` prop. */
function receiveAnchor(element: HTMLAnchorElement): void {
  element.dataset.refTag = 'anchor';
}

/** Accept any native child selected by Box's render function. */
function receiveChild(element: Element): void {
  element.setAttribute('data-ref-tag', 'child');
}

/** Render an anchor with its own native attributes and precise ref type. */
function renderLink(getProps: Parameters<NonNullable<BoxProps['asChild']>>[0]) {
  return (
    <a {...getProps()} href="/docs">
      Docs
    </a>
  );
}

export const anchor = <Box as="a" href="/docs" ref={receiveAnchor} />;
export const child = <Box asChild={renderLink} ref={receiveChild} />;
export const image = <Box as="img" alt="Preview" />;
