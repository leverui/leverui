import {
  RadioCard,
  type RadioCardCheckedRender,
  type RadioCardItemIndicatorProps,
  type RadioCardItemProps,
  type RadioCardRootProps,
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

export type RadioCardVariantAccepted = ExpectTrue<
  Assignable<{ variant: 'solid' }, Pick<RadioCardRootProps, 'variant'>>
>;
export type InvalidRadioCardVariantRejected = ExpectFalse<
  Assignable<{ variant: 'outlined' }, Pick<RadioCardRootProps, 'variant'>>
>;
export type RadioCardCssObjectRejected = ExpectFalse<
  'css' extends keyof RadioCardRootProps ? true : false
>;
export type RadioCardRecipeRejected = ExpectFalse<
  'recipe' extends keyof RadioCardRootProps ? true : false
>;
export type RadioCardStylePropRejected = ExpectFalse<
  'bg' extends keyof RadioCardRootProps ? true : false
>;
export type RadioCardNativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { background: 'red' } }, RadioCardRootProps>
>;
export type RadioCardItemValueRequired = ExpectFalse<
  Assignable<Record<string, never>, RadioCardItemProps>
>;
export type RadioCardItemCssObjectRejected = ExpectFalse<
  'css' extends keyof RadioCardItemProps ? true : false
>;
export type RadioCardCheckedMarkAccepted = ExpectTrue<
  Assignable<{ checked: RadioCardCheckedRender }, Pick<RadioCardItemIndicatorProps, 'checked'>>
>;
export type RadioCardCustomElementRefAccepted = ExpectTrue<
  Assignable<
    { checked: RadioCardCheckedRender; ref: (element: Element) => void },
    RadioCardItemIndicatorProps
  >
>;
export type RadioCardCustomSpanRefRejected = ExpectFalse<
  Assignable<
    { checked: RadioCardCheckedRender; ref: (element: HTMLSpanElement) => void },
    RadioCardItemIndicatorProps
  >
>;
export type RadioCardCheckedAsRejected = ExpectFalse<
  Assignable<{ checked: RadioCardCheckedRender; as: 'svg' }, RadioCardItemIndicatorProps>
>;
export type RadioCardCheckedAsChildRejected = ExpectFalse<
  Assignable<
    { checked: RadioCardCheckedRender; asChild: RadioCardCheckedRender },
    RadioCardItemIndicatorProps
  >
>;

/** Check the published external machine and selected-root declarations. */
export function PackedStoredRadioCard(): JSX.Element {
  const machine = RadioCard.useRadioCardGroup({ name: 'framework', defaultValue: 'solid' });
  return (
    <RadioCard.RootProvider value={machine} variant="outline" as="section">
      <RadioCard.Label>Stored framework</RadioCard.Label>
      <RadioCard.Item value="solid">
        <RadioCard.ItemHiddenInput />
        <RadioCard.ItemControl>
          <RadioCard.ItemText>Solid</RadioCard.ItemText>
        </RadioCard.ItemControl>
      </RadioCard.Item>
    </RadioCard.RootProvider>
  );
}
