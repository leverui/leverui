import type { Command } from '@leverui/components';

type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;
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
type RootProps = Parameters<typeof Command.Root>[0];
type ItemProps = Parameters<typeof Command.Item>[0];

export type RootCssRejected = ExpectFalse<'css' extends keyof RootProps ? true : false>;
export type RootRecipeRejected = ExpectFalse<'recipe' extends keyof RootProps ? true : false>;
export type RootStyleShorthandRejected = ExpectFalse<'bg' extends keyof RootProps ? true : false>;
export type ItemCssRejected = ExpectFalse<'css' extends keyof ItemProps ? true : false>;
export type RootClassAccepted = ExpectTrue<Assignable<string, NonNullable<RootProps['class']>>>;
export type RootNativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { width: string } }, RootProps>
>;
