import type { EmProps, QuoteProps, SpanProps, StrongProps } from '@leverui/components';

type ExpectFalse<Value extends false> = Value;
type ExpectTrue<Value extends true> = Value;
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

export type EmCssRejected = ExpectFalse<'css' extends keyof EmProps ? true : false>;
export type EmStylePropRejected = ExpectFalse<'fontStyle' extends keyof EmProps ? true : false>;
export type StrongCssRejected = ExpectFalse<'css' extends keyof StrongProps ? true : false>;
export type StrongStylePropRejected = ExpectFalse<
  'fontWeight' extends keyof StrongProps ? true : false
>;
export type QuoteCssRejected = ExpectFalse<'css' extends keyof QuoteProps ? true : false>;
export type QuoteStylePropRejected = ExpectFalse<
  'fontWeight' extends keyof QuoteProps ? true : false
>;
export type SpanCssRejected = ExpectFalse<'css' extends keyof SpanProps ? true : false>;
export type SpanStylePropRejected = ExpectFalse<
  'fontWeight' extends keyof SpanProps ? true : false
>;
export type SpanSvgSelectionAccepted = ExpectTrue<
  Assignable<{ as: 'svg'; viewBox: string }, SpanProps<'svg'>>
>;
