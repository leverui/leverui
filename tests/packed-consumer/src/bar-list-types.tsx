import { BarList, useChart } from '@leverui/components';
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
type RootProps = Parameters<typeof BarList.Root>[0];
type BarProps = Parameters<typeof BarList.Bar>[0];

export type RootCssPropRejected = ExpectFalse<'css' extends keyof RootProps ? true : false>;
export type RootStyleShorthandRejected = ExpectFalse<'bg' extends keyof RootProps ? true : false>;
export type RootClassAccepted = ExpectTrue<Assignable<string, NonNullable<RootProps['class']>>>;
export type BarNativeStyleAccepted = ExpectTrue<Assignable<{ style: { width: string } }, BarProps>>;

/** Typecheck the installed Bar List composition and its native CSS hooks. */
export function PackedBarList(): JSX.Element {
  const chart = useChart({
    data: [{ name: 'Direct', value: 50 }],
    series: [{ name: 'name', color: 'teal.subtle' }],
  });
  return (
    <BarList.Root chart={chart} barSize="3rem" class="traffic">
      <BarList.Title>Traffic</BarList.Title>
      <BarList.Content>
        <BarList.Bar tooltip class="traffic-bars" style={{ 'min-width': '12rem' }} />
        <BarList.Value />
      </BarList.Content>
    </BarList.Root>
  );
}
