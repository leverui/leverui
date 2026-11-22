import {
  CheckboxCard,
  CheckboxGroup,
  type CheckboxCardAddonProps,
  type CheckboxCardContentProps,
  type CheckboxCardControlProps,
  type CheckboxCardDescriptionProps,
  type CheckboxCardHiddenInputProps,
  type CheckboxCardIndicatorProps,
  type CheckboxCardLabelProps,
  type CheckboxCardRootProps,
  type UseCheckboxCardReturn,
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

export type CardSizeAccepted = ExpectTrue<Assignable<{ size: 'lg' }, CheckboxCardRootProps>>;
export type CardVariantAccepted = ExpectTrue<
  Assignable<{ variant: 'surface' }, CheckboxCardRootProps>
>;
export type InvalidCardSizeRejected = ExpectFalse<
  Assignable<{ size: 'huge' }, CheckboxCardRootProps>
>;
export type CardCssRejected = ExpectFalse<'css' extends keyof CheckboxCardRootProps ? true : false>;
export type CardRecipeRejected = ExpectFalse<
  'recipe' extends keyof CheckboxCardRootProps ? true : false
>;
export type CardBgRejected = ExpectFalse<'bg' extends keyof CheckboxCardRootProps ? true : false>;
export type CardNativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { width: string } }, CheckboxCardRootProps>
>;
export type CardControlCssRejected = ExpectFalse<
  'css' extends keyof CheckboxCardControlProps ? true : false
>;
export type CardContentCssRejected = ExpectFalse<
  'css' extends keyof CheckboxCardContentProps ? true : false
>;
export type CardLabelCssRejected = ExpectFalse<
  'css' extends keyof CheckboxCardLabelProps ? true : false
>;
export type CardDescriptionCssRejected = ExpectFalse<
  'css' extends keyof CheckboxCardDescriptionProps ? true : false
>;
export type CardAddonCssRejected = ExpectFalse<
  'css' extends keyof CheckboxCardAddonProps ? true : false
>;
export type CardIndicatorCssRejected = ExpectFalse<
  'css' extends keyof CheckboxCardIndicatorProps ? true : false
>;
export type CardControlChildAccepted = ExpectTrue<
  Assignable<
    { asChild: NonNullable<CheckboxCardControlProps['asChild']> },
    CheckboxCardControlProps
  >
>;
export type CardIndicatorSizeAccepted = ExpectTrue<
  Assignable<{ size: 'lg' }, CheckboxCardIndicatorProps>
>;
export type CardIndicatorChildAccepted = ExpectTrue<
  Assignable<
    { asChild: NonNullable<CheckboxCardIndicatorProps['asChild']> },
    CheckboxCardIndicatorProps
  >
>;
export type CardIndicatorSelectedSvgAccepted = ExpectTrue<
  Assignable<{ as: 'svg' }, CheckboxCardIndicatorProps<'svg'>>
>;
export type CardInputChildAccepted = ExpectTrue<
  Assignable<
    { asChild: NonNullable<CheckboxCardHiddenInputProps['asChild']> },
    CheckboxCardHiddenInputProps
  >
>;

/** Check the published external-machine and CSS choice declarations. */
export function StoredCard(): JSX.Element {
  const machine: UseCheckboxCardReturn = CheckboxCard.useCheckboxCard({ defaultChecked: true });
  return (
    <CheckboxCard.RootProvider value={machine} variant="outline">
      <CheckboxCard.HiddenInput />
      <CheckboxCard.Control>
        <CheckboxCard.Label>Stored card</CheckboxCard.Label>
        <CheckboxCard.Indicator />
      </CheckboxCard.Control>
    </CheckboxCard.RootProvider>
  );
}

/** Check that a card uses the published Checkbox group and root API. */
export const groupedCard = (
  <CheckboxGroup name="topics" defaultValue={['a']}>
    <CheckboxCard.Root as="section" value="a" size="sm">
      <CheckboxCard.HiddenInput />
      <CheckboxCard.Control>
        <CheckboxCard.Content>
          <CheckboxCard.Label>Alpha</CheckboxCard.Label>
          <CheckboxCard.Description>Group item</CheckboxCard.Description>
        </CheckboxCard.Content>
        <CheckboxCard.Indicator />
      </CheckboxCard.Control>
      <CheckboxCard.Addon>Detail</CheckboxCard.Addon>
    </CheckboxCard.Root>
  </CheckboxGroup>
);
