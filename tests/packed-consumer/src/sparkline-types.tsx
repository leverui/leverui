import { Sparkline, type SparklineData, type SparklineProps } from '@leverui/components';
import { type JSX } from '@solidjs/web';

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

export type CssRejected = ExpectFalse<'css' extends keyof SparklineProps ? true : false>;
export type RecipeRejected = ExpectFalse<'recipe' extends keyof SparklineProps ? true : false>;
export type StyleShorthandRejected = ExpectFalse<'bg' extends keyof SparklineProps ? true : false>;
export type NativeClassAccepted = ExpectTrue<
  Assignable<string, NonNullable<SparklineProps['class']>>
>;
export type NativeStyleAccepted = ExpectTrue<
  Assignable<{ data: readonly SparklineData[]; style: { width: string } }, SparklineProps>
>;

/** Typecheck a styled Sparkline without a provider or object CSS prop. */
export function PackedSparkline(): JSX.Element {
  return <Sparkline data={[{ value: 12 }, { value: 18 }]} type="area" class="traffic" />;
}
