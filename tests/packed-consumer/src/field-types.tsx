import {
  Field,
  Input,
  useField,
  type FieldRootProps,
  type FieldRootProviderProps,
  type FieldRequiredIndicatorProps,
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

export type FieldRequiredAccepted = ExpectTrue<Assignable<{ required: true }, FieldRootProps>>;
export type FieldTargetAccepted = ExpectTrue<Assignable<{ target: string }, FieldRootProps>>;
export type FieldOrientationAccepted = ExpectTrue<
  Assignable<{ orientation: { base: 'vertical'; md: 'horizontal' } }, FieldRootProps>
>;
export type InvalidOrientationRejected = ExpectFalse<
  Assignable<{ orientation: 'diagonal' }, FieldRootProps>
>;
export type FieldCssPropRejected = ExpectFalse<'css' extends keyof FieldRootProps ? true : false>;
export type FieldRecipePropRejected = ExpectFalse<
  'recipe' extends keyof FieldRootProps ? true : false
>;
export type FieldStyleShorthandRejected = ExpectFalse<
  'bg' extends keyof FieldRootProps ? true : false
>;
export type ExternalValueRequired = ExpectFalse<
  Assignable<{ value?: never }, FieldRootProviderProps>
>;
export type ExternalMachinePropsRejected = ExpectFalse<
  'invalid' extends keyof FieldRootProviderProps ? true : false
>;
export type OptionalFallbackAccepted = ExpectTrue<
  Assignable<{ fallback: string }, FieldRequiredIndicatorProps>
>;

/** Compile the installed root, provider, and styled parts together. */
export function typedField(): JSX.Element {
  const field = useField({ id: 'typed-field', required: true });
  return (
    <Field.RootProvider value={field} class="typed-field" style={{ width: '320px' }}>
      <Field.Label class="typed-field-label">Typed label</Field.Label>
      <Input />
      <Field.HelperText>Typed helper</Field.HelperText>
      <Field.ErrorText>Typed error</Field.ErrorText>
      <Field.RequiredIndicator fallback="Optional" />
    </Field.RootProvider>
  );
}
