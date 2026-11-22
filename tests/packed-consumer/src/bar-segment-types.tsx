import { BarSegment, useChart } from '@leverui/components';
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
type RootProps = Parameters<typeof BarSegment.Root>[0];
type BarProps = Parameters<typeof BarSegment.Bar>[0];

export type RootCssRejected = ExpectFalse<'css' extends keyof RootProps ? true : false>;
export type RootRecipeRejected = ExpectFalse<'recipe' extends keyof RootProps ? true : false>;
export type RootStyleShorthandRejected = ExpectFalse<'bg' extends keyof RootProps ? true : false>;
export type RootClassAccepted = ExpectTrue<Assignable<string, NonNullable<RootProps['class']>>>;
export type BarNativeStyleAccepted = ExpectTrue<Assignable<{ style: { width: string } }, BarProps>>;

/** Typecheck the installed Bar Segment composition and its native CSS hooks. */
export function PackedBarSegment(): JSX.Element {
  const chart = useChart({ data: [{ name: 'Direct', value: 50, color: 'teal.500' }] });
  return (
    <BarSegment.Root chart={chart} barSize="3rem" class="traffic">
      <BarSegment.Content>
        <BarSegment.Label />
        <BarSegment.Bar tooltip class="traffic-bar" />
        <BarSegment.Value />
      </BarSegment.Content>
    </BarSegment.Root>
  );
}
