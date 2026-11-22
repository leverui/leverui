import {
  PinInput,
  usePinInput,
  type PinInputInputProps,
  type PinInputRootProps,
  type PinInputRootProviderProps,
} from '@leverui/components';
import { type JSX } from '@solidjs/web';

const rootProps: PinInputRootProps = {
  count: 4,
  name: 'code',
  size: 'md',
  variant: 'outline',
  attached: true,
};

type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;

export type ResponsiveSizeAccepted = ExpectTrue<
  { count: 4; size: { base: 'xs'; md: 'lg' } } extends PinInputRootProps ? true : false
>;
export type ResponsiveAttachedAccepted = ExpectTrue<
  { count: 4; attached: { base: true; md: false } } extends PinInputRootProps ? true : false
>;
export type RecipePropRejected = ExpectFalse<
  'recipe' extends keyof PinInputRootProps ? true : false
>;
export type CssPropRejected = ExpectFalse<'css' extends keyof PinInputRootProps ? true : false>;
export type StyleShorthandRejected = ExpectFalse<
  'bg' extends keyof PinInputRootProps ? true : false
>;
export type PartCssPropRejected = ExpectFalse<
  'css' extends keyof PinInputInputProps ? true : false
>;
export type ProviderMachinePropRejected = ExpectFalse<
  'mask' extends keyof PinInputRootProviderProps ? true : false
>;

/** Compile a caller-owned machine against installed Pin Input declarations. */
export function PackedPinInputTypes(): JSX.Element {
  const pinInput = usePinInput({ count: 2, defaultValue: ['4', '2'] });
  return (
    <PinInput.RootProvider value={pinInput} size="sm" class="typed-pin" style={{ width: '240px' }}>
      <PinInput.HiddenInput />
      <PinInput.Control>
        <PinInput.Input index={0} />
        <PinInput.Input index={1} />
      </PinInput.Control>
    </PinInput.RootProvider>
  );
}

void rootProps;
