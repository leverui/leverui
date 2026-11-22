import {
  Listbox,
  createListCollection,
  type ListboxInputProps,
  type ListboxItemProps,
  type ListboxRootProps,
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

export type ListboxVariantAccepted = ExpectTrue<
  Assignable<{ variant: 'solid' }, Pick<ListboxRootProps, 'variant'>>
>;
export type InvalidListboxVariantRejected = ExpectFalse<
  Assignable<{ variant: 'outlined' }, Pick<ListboxRootProps, 'variant'>>
>;
export type ListboxObjectCssRemoved = ExpectFalse<
  'css' extends keyof ListboxRootProps ? true : false
>;
export type ListboxRecipeRemoved = ExpectFalse<
  'recipe' extends keyof ListboxRootProps ? true : false
>;
export type ListboxStylePropRemoved = ExpectFalse<
  'bg' extends keyof ListboxRootProps ? true : false
>;
export type ListboxInputChildAccepted = ExpectTrue<
  Assignable<{ asChild: NonNullable<ListboxInputProps['asChild']> }, ListboxInputProps>
>;
export type ListboxItemRequired = ExpectFalse<Assignable<Record<string, never>, ListboxItemProps>>;

const solid = { label: 'Solid', value: 'solid' };
const collection = createListCollection({ items: [solid] });
const TypedRoot: Listbox.RootComponent = Listbox.Root;

/** Check the installed generic root keeps typed collection items. */
export function PackedTypedListboxRoot(): JSX.Element {
  return <TypedRoot collection={collection} />;
}

/** Check the installed external-machine and selected-root declarations. */
export function PackedStoredListbox(): JSX.Element {
  const machine = Listbox.useListbox({ collection, defaultValue: ['solid'] });
  return (
    <Listbox.RootProvider value={machine} variant="plain" as="section">
      <Listbox.Label>Stored framework</Listbox.Label>
      <Listbox.Content>
        <Listbox.List>
          <Listbox.Item item={solid}>{solid.label}</Listbox.Item>
        </Listbox.List>
      </Listbox.Content>
    </Listbox.RootProvider>
  );
}
