import { Timeline, type TimelineRootProps, type TimelineTitleProps } from '@leverui/components';
import type * as LeverUIPackage from '@leverui/components';
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

export type StyleHookRemoved = ExpectFalse<
  'useTimelineStyles' extends keyof typeof LeverUIPackage ? true : false
>;
export type ObjectCssRejected = ExpectFalse<'css' extends keyof TimelineRootProps ? true : false>;
export type RecipeRejected = ExpectFalse<'recipe' extends keyof TimelineRootProps ? true : false>;
export type UnknownSizeRejected = ExpectFalse<Assignable<{ size: 'ghost' }, TimelineRootProps>>;

/** Compile responsive choices and native styles from the published package. */
export function AcceptedTimelineTypes(): JSX.Element {
  return (
    <Timeline.Root size={{ base: 'sm', md: 'lg' }} variant="outline">
      <Timeline.Item>
        <Timeline.Connector>
          <Timeline.Separator />
          <Timeline.Indicator>1</Timeline.Indicator>
        </Timeline.Connector>
        <Timeline.Content>
          <Timeline.Title style={{ 'white-space': 'nowrap' }}>Shipped</Timeline.Title>
        </Timeline.Content>
      </Timeline.Item>
    </Timeline.Root>
  );
}

/** Keep unsupported style objects and arbitrary style props out of Timeline. */
export function RejectedTimelineTypes(): JSX.Element {
  return (
    <>
      {/* @ts-expect-error Timeline has no CSS object prop. */}
      <Timeline.Root css={{ padding: '4px' }} />
      {/* @ts-expect-error Timeline has no custom recipe prop. */}
      <Timeline.Root recipe={{ base: { color: 'red' } }} />
      {/* @ts-expect-error Timeline parts have no arbitrary style prop. */}
      <Timeline.Title padding="4px" />
    </>
  );
}

export type NativeTitleStyle = TimelineTitleProps['style'];
