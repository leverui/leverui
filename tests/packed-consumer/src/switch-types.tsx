import {
  Switch,
  type SwitchCheckedChangeDetails,
  type SwitchControlProps,
  type SwitchIndicatorProps,
  type SwitchRootProviderProps,
  type SwitchRootProps,
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

export type SwitchAppearancePropsAccepted = ExpectTrue<
  Assignable<
    { size: 'lg'; variant: 'raised'; colorPalette: 'blue' },
    Pick<SwitchRootProps, 'size' | 'variant' | 'colorPalette'>
  >
>;
export type SwitchControlStyleAccepted = ExpectTrue<
  Assignable<{ style: { padding: string } }, Pick<SwitchControlProps, 'style'>>
>;
export type SwitchCssPropRemoved = ExpectFalse<'css' extends keyof SwitchRootProps ? true : false>;
export type SwitchRecipePropRemoved = ExpectFalse<
  'recipe' extends keyof SwitchRootProps ? true : false
>;
export type SwitchStylePropRemoved = ExpectFalse<
  'p' extends keyof SwitchControlProps ? true : false
>;
export type SwitchProviderCssPropRemoved = ExpectFalse<
  'css' extends keyof SwitchRootProviderProps ? true : false
>;
export type SwitchIndicatorCssPropRemoved = ExpectFalse<
  'css' extends keyof SwitchIndicatorProps ? true : false
>;
export type SwitchChangeChecked = ExpectTrue<
  Assignable<SwitchCheckedChangeDetails['checked'], boolean>
>;

/** Compile the installed provider and optional indicator contracts. */
export function PackedSwitchTypes(): JSX.Element {
  const machine = Switch.useSwitch({ defaultChecked: true });
  return (
    <Switch.PropsProvider value={{ size: 'lg', variant: 'raised' }}>
      <Switch.RootProvider
        value={machine}
        style={{ '--leverui-colors-color-palette-solid': 'rgb(8, 88, 152)' }}
      >
        <Switch.HiddenInput />
        <Switch.Control style={{ 'border-radius': '7px' }}>
          <Switch.Indicator fallback="Off">On</Switch.Indicator>
          <Switch.Thumb>
            <Switch.ThumbIndicator fallback="−">✓</Switch.ThumbIndicator>
          </Switch.Thumb>
        </Switch.Control>
        <Switch.Label>Notifications</Switch.Label>
      </Switch.RootProvider>
    </Switch.PropsProvider>
  );
}
