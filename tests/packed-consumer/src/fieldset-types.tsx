import {
  Fieldset,
  useFieldset,
  type FieldsetLegendProps,
  type FieldsetContentProps,
  type FieldsetRootProps,
  type FieldsetRootProviderProps,
  type UseFieldsetReturn,
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
type RootInvalidAttribute = ReturnType<
  ReturnType<UseFieldsetReturn>['getRootProps']
>['data-invalid'];

export type DefaultRefAccepted = ExpectTrue<
  Assignable<{ ref: (element: HTMLFieldSetElement) => void }, FieldsetRootProps>
>;
export type SelectedRootRefAccepted = ExpectTrue<
  Assignable<{ as: 'section'; ref: (element: Element) => void }, FieldsetRootProps>
>;
export type WrongSelectedRootRefRejected = ExpectFalse<
  Assignable<{ as: 'section'; ref: (element: HTMLFieldSetElement) => void }, FieldsetRootProps>
>;
export type SelectedLegendRefAccepted = ExpectTrue<
  Assignable<{ as: 'div'; ref: (element: Element) => void }, FieldsetLegendProps>
>;
export type WrongSelectedLegendRefRejected = ExpectFalse<
  Assignable<{ as: 'div'; ref: (element: HTMLLegendElement) => void }, FieldsetLegendProps>
>;
export type RootProviderValueRequired = ExpectFalse<
  Assignable<{ value?: never }, FieldsetRootProviderProps>
>;
export type RuntimeDataAttributeAccepted = ExpectTrue<
  Assignable<'' | undefined, RootInvalidAttribute>
>;
export type BooleanDataAttributeRejected = ExpectFalse<Assignable<true, RootInvalidAttribute>>;
export type RootObjectCssRemoved = ExpectFalse<
  'css' extends keyof FieldsetRootProps ? true : false
>;
export type RootRecipeRemoved = ExpectFalse<
  'recipe' extends keyof FieldsetRootProps ? true : false
>;
export type PartObjectCssRemoved = ExpectFalse<
  'css' extends keyof FieldsetContentProps ? true : false
>;
export type NativeClassAndStyleAccepted = ExpectTrue<
  Assignable<{ class: string; style: string }, FieldsetRootProps>
>;

/** Compile the installed caller-owned Fieldset and its associated parts. */
export function typedFieldset(): JSX.Element {
  const fieldset = useFieldset({ id: 'typed-fieldset', invalid: true });
  return (
    <Fieldset.RootProvider value={fieldset}>
      <Fieldset.Legend>Typed group</Fieldset.Legend>
      <Fieldset.HelperText>Typed helper</Fieldset.HelperText>
      <Fieldset.Content>Typed controls</Fieldset.Content>
      <Fieldset.ErrorText>Typed error</Fieldset.ErrorText>
    </Fieldset.RootProvider>
  );
}
