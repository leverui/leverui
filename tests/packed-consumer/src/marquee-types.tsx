import {
  Marquee,
  MarqueeEdge,
  MarqueeRoot,
  useMarquee,
  type MarqueeEdgeProps,
  type MarqueeRootProps,
  type UseMarqueeProps,
} from '@leverui/components';
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

export type RootAcceptsMotionProps = ExpectTrue<
  Assignable<{ side: 'bottom'; speed: number; autoFill: boolean }, MarqueeRootProps>
>;
export type RootRejectsInvalidSide = ExpectFalse<Assignable<{ side: 'diagonal' }, UseMarqueeProps>>;
export type EdgeRequiresSide = ExpectFalse<Assignable<object, MarqueeEdgeProps>>;
export type RootRejectsCssObject = ExpectFalse<'css' extends keyof MarqueeRootProps ? true : false>;
export type RootRejectsRecipe = ExpectFalse<'recipe' extends keyof MarqueeRootProps ? true : false>;
export type EdgeRejectsCssObject = ExpectFalse<'css' extends keyof MarqueeEdgeProps ? true : false>;
export type RootKeepsNativeStyle = ExpectTrue<
  'style' extends keyof MarqueeRootProps ? true : false
>;

/** Exercise direct and compound Marquee exports from an isolated install. */
export function MarqueeConsumer(): JSX.Element {
  return (
    <MarqueeRoot spacing="1rem" aria-label="Partner logos">
      <MarqueeEdge side="start" />
      <Marquee.Viewport>
        <Marquee.Content>
          <Marquee.Item>First logo</Marquee.Item>
          <Marquee.Item>Second logo</Marquee.Item>
        </Marquee.Content>
      </Marquee.Viewport>
      <Marquee.Edge side="end" />
    </MarqueeRoot>
  );
}

/** Exercise a caller-owned Solid machine and compound provider. */
export function MarqueeStoreConsumer(): JSX.Element {
  const machine = useMarquee({ defaultPaused: true });
  return (
    <Marquee.RootProvider value={machine}>
      <Marquee.Viewport>
        <Marquee.Content>
          <Marquee.Item>Stored item</Marquee.Item>
        </Marquee.Content>
      </Marquee.Viewport>
    </Marquee.RootProvider>
  );
}
