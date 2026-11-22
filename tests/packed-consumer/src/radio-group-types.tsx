import {
  RadioGroup,
  type RadioGroupItemIndicatorProps,
  type RadioGroupItemProps,
  type RadioGroupRootProps,
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
type ButtonIndicatorProps = Extract<RadioGroupItemIndicatorProps<'button'>, { as: 'button' }>;

export type RadioGroupVariantAccepted = ExpectTrue<
  Assignable<{ variant: 'solid' }, Pick<RadioGroupRootProps, 'variant'>>
>;
export type InvalidRadioGroupVariantRejected = ExpectFalse<
  Assignable<{ variant: 'outlined' }, Pick<RadioGroupRootProps, 'variant'>>
>;
export type RadioGroupCssObjectRejected = ExpectFalse<
  Assignable<{ css: { color: 'red' } }, RadioGroupRootProps>
>;
export type RadioGroupRecipeRejected = ExpectFalse<
  Assignable<{ recipe: object }, RadioGroupRootProps>
>;
export type RadioGroupGeneralStylePropRejected = ExpectFalse<
  Assignable<{ bg: 'red' }, RadioGroupRootProps>
>;
export type RadioGroupNativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { color: 'red' } }, Pick<RadioGroupRootProps, 'style'>>
>;
export type RadioGroupPartCssObjectRejected = ExpectFalse<
  Assignable<{ css: { color: 'red' } }, RadioGroupItemProps>
>;
export type RadioGroupItemValueRequired = ExpectFalse<
  Assignable<Record<string, never>, RadioGroupItemProps>
>;
export type IndicatorButtonRefAccepted = ExpectTrue<
  Assignable<
    { as: 'button'; ref: (element: HTMLButtonElement) => void },
    RadioGroupItemIndicatorProps<'button'>
  >
>;
export type IndicatorInputRefRejectedForButton = ExpectFalse<
  Assignable<
    { as: 'button'; ref: (element: HTMLInputElement) => void },
    RadioGroupItemIndicatorProps<'button'>
  >
>;
export type IndicatorButtonAttributeAccepted = ExpectTrue<
  'formaction' extends keyof ButtonIndicatorProps ? true : false
>;
export type IndicatorSpanAttributeRejectedForButton = ExpectFalse<
  'cite' extends keyof ButtonIndicatorProps ? true : false
>;
export type IndicatorChildRefAccepted = ExpectTrue<
  Assignable<
    {
      asChild: NonNullable<RadioGroupItemIndicatorProps['asChild']>;
      ref: (element: Element) => void;
    },
    RadioGroupItemIndicatorProps
  >
>;
export type IndicatorChildSpanRefRejected = ExpectFalse<
  Assignable<
    {
      asChild: NonNullable<RadioGroupItemIndicatorProps['asChild']>;
      ref: (element: HTMLSpanElement) => void;
    },
    RadioGroupItemIndicatorProps
  >
>;

/** Compile public native and child indicator paths from an installed archive. */
export function PackedPolymorphicRadioGroup(): JSX.Element {
  return (
    <RadioGroup.Root name="framework" defaultValue="solid">
      <RadioGroup.Item value="solid">
        <RadioGroup.ItemHiddenInput />
        <RadioGroup.ItemIndicator as="button" type="button" />
        <RadioGroup.ItemIndicator
          asChild={
            /** Put indicator state on a caller-owned native element. */
            (getProps) => <span {...getProps()} />
          }
        />
        <RadioGroup.ItemText>Solid</RadioGroup.ItemText>
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
}
