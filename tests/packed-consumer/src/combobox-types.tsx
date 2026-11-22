import {
  Combobox,
  createListCollection,
  type ComboboxInputProps,
  type ComboboxItemProps,
  type ComboboxRootProps,
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

export type ComboboxSizeAccepted = ExpectTrue<
  Assignable<{ size: 'lg' }, Pick<ComboboxRootProps, 'size'>>
>;
export type ComboboxVariantAccepted = ExpectTrue<
  Assignable<{ variant: 'flushed' }, Pick<ComboboxRootProps, 'variant'>>
>;
export type InvalidComboboxSizeRejected = ExpectFalse<
  Assignable<{ size: 'huge' }, Pick<ComboboxRootProps, 'size'>>
>;
export type ComboboxObjectCssRemoved = ExpectFalse<
  'css' extends keyof ComboboxRootProps ? true : false
>;
export type ComboboxRecipeRemoved = ExpectFalse<
  'recipe' extends keyof ComboboxRootProps ? true : false
>;
export type ComboboxStylePropRemoved = ExpectFalse<
  'bg' extends keyof ComboboxRootProps ? true : false
>;
export type ComboboxInputChildAccepted = ExpectTrue<
  Assignable<{ asChild: NonNullable<ComboboxInputProps['asChild']> }, ComboboxInputProps>
>;
export type ComboboxItemRequired = ExpectFalse<
  Assignable<Record<string, never>, ComboboxItemProps>
>;

const collection = createListCollection({ items: [{ label: 'Solid', value: 'solid' }] });
const TypedRoot: Combobox.RootComponent = Combobox.Root;

/** Check the installed compound component type retains generic items. */
export function PackedTypedComboboxRoot(): JSX.Element {
  return <TypedRoot collection={collection} />;
}

/** Check the installed external-machine and selected-root declarations. */
export function PackedStoredCombobox(): JSX.Element {
  const machine = Combobox.useCombobox({ collection, defaultValue: ['solid'] });
  return (
    <Combobox.RootProvider value={machine} size="lg" as="section">
      <Combobox.Label>Stored framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input />
      </Combobox.Control>
    </Combobox.RootProvider>
  );
}
