import {
  NumberInput,
  useNumberInput,
  type NumberInputInputProps,
  type NumberInputRootProps,
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

export type ResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ size: { base: 'xs'; md: 'lg' } }, NumberInputRootProps>
>;
export type InvalidSizeRejected = ExpectFalse<Assignable<{ size: '2xl' }, NumberInputRootProps>>;
export type CssObjectRejected = ExpectFalse<
  Assignable<{ css: { bg: 'red' } }, NumberInputRootProps>
>;
export type StylePropRejected = ExpectFalse<Assignable<{ ps: '4' }, NumberInputInputProps>>;
export type NativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { width: string } }, NumberInputRootProps>
>;

const rootProps: NumberInputRootProps = {
  defaultValue: 2,
  min: 0,
  max: 4,
  step: 2,
  name: 'quantity',
  size: 'md',
  variant: 'outline',
};

/** Compile a caller-owned machine against the installed public declarations. */
export function PackedNumberInputTypes(): JSX.Element {
  const numberInput = useNumberInput({ defaultValue: 2 });
  return (
    <NumberInput.RootProvider value={numberInput} size="sm">
      <NumberInput.Label>Quantity</NumberInput.Label>
      <NumberInput.Input />
      <NumberInput.Control />
      <NumberInput.Scrubber />
      <NumberInput.ValueText />
    </NumberInput.RootProvider>
  );
}

void rootProps;
