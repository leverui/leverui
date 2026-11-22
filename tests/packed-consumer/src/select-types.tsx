import {
  Select,
  type SelectItemProps,
  type SelectRootProps,
  type SelectValueChangeDetails,
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

export type SelectSizeAccepted = ExpectTrue<
  Assignable<{ size: 'lg' }, Pick<SelectRootProps, 'size'>>
>;
export type InvalidSelectSizeRejected = ExpectFalse<
  Assignable<{ size: 'huge' }, Pick<SelectRootProps, 'size'>>
>;
export type SelectVariantAccepted = ExpectTrue<
  Assignable<{ variant: 'ghost' }, Pick<SelectRootProps, 'variant'>>
>;
export type InvalidSelectVariantRejected = ExpectFalse<
  Assignable<{ variant: 'solid' }, Pick<SelectRootProps, 'variant'>>
>;
export type SelectRecipeRejected = ExpectFalse<
  'recipe' extends keyof SelectRootProps ? true : false
>;
export type SelectCssRejected = ExpectFalse<'css' extends keyof SelectItemProps ? true : false>;
export type SelectNativeStyleAccepted = ExpectTrue<
  Assignable<{ item: { label: 'Solid'; value: 'solid' }; style: { color: 'red' } }, SelectItemProps>
>;
export type SelectItemRequired = ExpectFalse<Assignable<Record<string, never>, SelectItemProps>>;
export type SelectChangeValue = ExpectTrue<Assignable<SelectValueChangeDetails['value'], string[]>>;

/** Compile the installed collection, external machine, and compound parts. */
export function PackedSelectTypes(): JSX.Element {
  const item = { label: 'Solid', value: 'solid' };
  const collection = Select.createListCollection({
    items: [item],
  });
  const machine = Select.useSelect({ collection, defaultValue: ['solid'] });
  return (
    <Select.PropsProvider value={{ size: 'sm', variant: 'subtle' }}>
      <Select.RootProvider value={machine}>
        <Select.HiddenSelect />
        <Select.Label>Framework</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.ClearTrigger />
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            <Select.List>
              <Select.Item item={item}>
                <Select.ItemText>Solid</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Select.RootProvider>
    </Select.PropsProvider>
  );
}
