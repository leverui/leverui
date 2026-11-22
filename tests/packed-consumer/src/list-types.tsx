import {
  List,
  type ListIndicatorProps,
  type ListItemProps,
  type ListRootProps,
} from '@leverui/components';
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
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;

export type OrderedRootAccepted = ExpectTrue<
  Assignable<{ as: 'ol'; start: number }, ListRootProps<'ol'>>
>;
export type NativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { color: string } }, ListItemProps>
>;
export type InvalidVariantRejected = ExpectFalse<Assignable<{ variant: 'steps' }, ListRootProps>>;
export type RootObjectCssRejected = ExpectFalse<'css' extends keyof ListRootProps ? true : false>;
export type ItemObjectCssRejected = ExpectFalse<'css' extends keyof ListItemProps ? true : false>;
export type IndicatorObjectCssRejected = ExpectFalse<
  'css' extends keyof ListIndicatorProps ? true : false
>;
export type RootRecipeRejected = ExpectFalse<'recipe' extends keyof ListRootProps ? true : false>;
export type RootStylePropRejected = ExpectFalse<'gap' extends keyof ListRootProps ? true : false>;
export type StyleHookRemoved = ExpectFalse<
  'useListStyles' extends keyof typeof LeverUIPackage ? true : false
>;

/** Compile native ordered lists and authored variants from the archive. */
export function PackedListTypes(): JSX.Element {
  return (
    <List.Root as="ol" start={3} variant={{ base: 'marker', md: 'plain' }}>
      <List.Item style={{ color: 'rebeccapurple' }}>
        <List.Indicator>✓</List.Indicator>
        Typed item
      </List.Item>
    </List.Root>
  );
}
