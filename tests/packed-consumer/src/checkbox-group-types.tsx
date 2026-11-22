import type { CheckboxGroupProps } from '@leverui/components';

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

export type GroupCssRejected = ExpectFalse<'css' extends keyof CheckboxGroupProps ? true : false>;
export type GroupStylePropRejected = ExpectFalse<
  'gap' extends keyof CheckboxGroupProps ? true : false
>;
export type GroupNativeStyleAccepted = ExpectTrue<
  Assignable<{ 'aria-label': string; style: { gap: string } }, CheckboxGroupProps>
>;
export type GroupSelectedTagAccepted = ExpectTrue<
  Assignable<{ as: 'section'; 'aria-label': string }, CheckboxGroupProps<'section'>>
>;
