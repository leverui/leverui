import { DataList, type DataListItemProps, type DataListRootProps } from '@leverui/components';
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

export type NativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { color: string } }, DataListItemProps>
>;
export type InvalidSizeRejected = ExpectFalse<Assignable<{ size: 'xl' }, DataListRootProps>>;
export type InvalidOrientationRejected = ExpectFalse<
  Assignable<{ orientation: 'diagonal' }, DataListRootProps>
>;
export type RootObjectCssRejected = ExpectFalse<
  'css' extends keyof DataListRootProps ? true : false
>;
export type ItemObjectCssRejected = ExpectFalse<
  'css' extends keyof DataListItemProps ? true : false
>;
export type RootRecipeRejected = ExpectFalse<
  'recipe' extends keyof DataListRootProps ? true : false
>;
export type RootStylePropRejected = ExpectFalse<
  'gap' extends keyof DataListRootProps ? true : false
>;
export type StyleHookRemoved = ExpectFalse<
  'useDataListStyles' extends keyof typeof LeverUIPackage ? true : false
>;

/** Compile semantic parts, responsive choices, and native CSS customization. */
export function PackedDataListTypes(): JSX.Element {
  return (
    <DataList.Root orientation={{ base: 'vertical', md: 'horizontal' }} class="account-details">
      <DataList.Item style={{ 'padding-top': '1rem' }}>
        <DataList.ItemLabel>Status</DataList.ItemLabel>
        <DataList.ItemValue>Active</DataList.ItemValue>
      </DataList.Item>
    </DataList.Root>
  );
}
