import {
  NativeSelect,
  type NativeSelectFieldProps,
  type NativeSelectRootProps,
} from '@leverui/components';

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

export type ResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ size: { base: 'sm'; md: 'lg' } }, NativeSelectRootProps>
>;
export type InvalidVariantRejected = ExpectFalse<
  Assignable<{ variant: 'oversized' }, NativeSelectRootProps>
>;
export type NativeFieldRefAccepted = ExpectTrue<
  Assignable<{ ref: (element: HTMLSelectElement) => void }, NativeSelectFieldProps>
>;
export type FieldSizeRejected = ExpectFalse<Assignable<{ size: 'lg' }, NativeSelectFieldProps>>;
export type NativeDefaultAccepted = ExpectTrue<
  Assignable<{ defaultValue: readonly ['ca', 'us'] }, NativeSelectFieldProps>
>;

export const nativeSelect = (
  <NativeSelect.Root size="sm">
    <NativeSelect.Field aria-label="Country" placeholder="Choose">
      <option value="ca">Canada</option>
    </NativeSelect.Field>
    <NativeSelect.Indicator />
  </NativeSelect.Root>
);
