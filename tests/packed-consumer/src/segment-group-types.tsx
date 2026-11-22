import {
  SegmentGroup,
  type SegmentGroupItemProps,
  type SegmentGroupItemsProps,
  type SegmentGroupPropsProviderProps,
  type SegmentGroupRootProps,
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
type ProviderDefaults = Exclude<SegmentGroupPropsProviderProps['value'], () => unknown>;
type ItemElement = NonNullable<Parameters<typeof SegmentGroup.Item>[0]['as']>;
type ItemsElement = NonNullable<Parameters<typeof SegmentGroup.Items>[0]['as']>;

export type SegmentSizeAccepted = ExpectTrue<
  Assignable<{ size: 'sm' }, Pick<SegmentGroupRootProps, 'size'>>
>;
export type InvalidSegmentSizeRejected = ExpectFalse<
  Assignable<{ size: 'huge' }, Pick<SegmentGroupRootProps, 'size'>>
>;
export type SegmentCssObjectRejected = ExpectFalse<
  'css' extends keyof SegmentGroupRootProps ? true : false
>;
export type SegmentStyleShorthandRejected = ExpectFalse<
  'bg' extends keyof SegmentGroupRootProps ? true : false
>;
export type SegmentItemValueRequired = ExpectFalse<
  Assignable<Record<string, never>, SegmentGroupItemProps>
>;
export type SegmentItemsRequired = ExpectFalse<
  Assignable<Record<string, never>, SegmentGroupItemsProps>
>;
export type ProviderChildrenRejected = ExpectFalse<
  'children' extends keyof ProviderDefaults ? true : false
>;
export type InteractiveItemElementRejected = ExpectFalse<
  'button' extends ItemElement ? true : false
>;
export type InteractiveItemsElementRejected = ExpectFalse<
  'button' extends ItemsElement ? true : false
>;

/** Compile external machine, provider, and custom item paths from an archive. */
export function PackedPolymorphicSegmentGroup(): JSX.Element {
  const machine = SegmentGroup.useSegmentGroup({ name: 'framework', defaultValue: 'React' });
  return (
    <SegmentGroup.PropsProvider value={{ size: 'sm', class: 'consumer-segments' }}>
      <SegmentGroup.RootProvider value={machine}>
        <SegmentGroup.Indicator />
        <SegmentGroup.Item value="React">
          <SegmentGroup.ItemText>React</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
        <SegmentGroup.Items as="div" items={['Solid']} />
        <SegmentGroup.Item
          value="Vue"
          asChild={
            /** Render the radio inside a caller-owned noninteractive element. */
            (getProps) => <div {...getProps()} />
          }
        >
          <SegmentGroup.ItemText>Vue</SegmentGroup.ItemText>
          <SegmentGroup.ItemHiddenInput />
        </SegmentGroup.Item>
      </SegmentGroup.RootProvider>
    </SegmentGroup.PropsProvider>
  );
}
