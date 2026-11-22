import { Wrap, WrapItem, type WrapItemProps, type WrapProps } from '@leverui/components';
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

export type NativeSectionAccepted = ExpectTrue<
  Assignable<{ as: 'section'; gap: '2'; children: JSX.Element }, WrapProps<'section'>>
>;
export type ResponsiveGapAccepted = ExpectTrue<
  Assignable<{ gap: { base: '2'; md: '4' } }, WrapProps>
>;
export type CssObjectRejected = ExpectFalse<'css' extends keyof WrapProps ? true : false>;
export type WidthPropRejected = ExpectFalse<'width' extends keyof WrapProps ? true : false>;
export type ItemAlignPropRejected = ExpectFalse<
  'alignItems' extends keyof WrapItemProps ? true : false
>;
export type ItemCssRejected = ExpectFalse<'css' extends keyof WrapItemProps ? true : false>;
export type NativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { width: string } }, WrapItemProps>
>;
export type WrongSectionRefRejected = ExpectFalse<
  Assignable<{ as: 'section'; ref: (element: HTMLButtonElement) => void }, WrapProps<'section'>>
>;

/** Receive the selected native section from the packed Wrap declaration. */
function receiveSection(element: HTMLElement): void {
  element.dataset.wrapRef = 'section';
}

export const section = (
  <Wrap as="section" ref={receiveSection} gap="2">
    <WrapItem>Content</WrapItem>
  </Wrap>
);
