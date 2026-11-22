import {
  Badge,
  BadgePropsProvider,
  type BadgeProps,
  type BadgePropsProviderProps,
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
type ProviderDefaults = Exclude<BadgePropsProviderProps['value'], (...args: never[]) => unknown>;

export type BadgeVariantAccepted = ExpectTrue<Assignable<{ variant: 'surface' }, BadgeProps>>;
export type InvalidBadgeVariantRejected = ExpectFalse<
  Assignable<{ variant: 'glowing' }, BadgeProps>
>;
export type ResponsiveBadgeSizeAccepted = ExpectTrue<
  Assignable<{ size: { base: 'xs'; md: 'lg' } }, BadgeProps>
>;
export type ReadonlyBadgeSizeAccepted = ExpectTrue<
  Assignable<{ size: readonly ['xs', null, 'lg'] }, BadgeProps>
>;
export type CssObjectRejected = ExpectFalse<
  Assignable<{ css: { background: string } }, BadgeProps>
>;
export type GeneralStylePropRejected = ExpectFalse<Assignable<{ bg: string }, BadgeProps>>;
export type RecipePropRejected = ExpectFalse<Assignable<{ recipe: object }, BadgeProps>>;
export type ExplicitUndefinedBadgeAccepted = ExpectTrue<
  Assignable<{ unstyled: boolean | undefined }, BadgeProps>
>;
export type ExplicitUndefinedProviderAccepted = ExpectTrue<
  Assignable<{ unstyled: boolean | undefined }, ProviderDefaults>
>;
export type ProviderClassAccepted = ExpectTrue<Assignable<{ class: string }, ProviderDefaults>>;
export type ProviderTagRejected = ExpectFalse<'as' extends keyof ProviderDefaults ? true : false>;
export type ProviderNativeRefRejected = ExpectFalse<
  'ref' extends keyof ProviderDefaults ? true : false
>;
export type SectionBadgeRefAccepted = ExpectTrue<
  Assignable<{ as: 'section'; ref: (element: HTMLElement) => void }, BadgeProps<'section'>>
>;
export type WrongSectionBadgeRefRejected = ExpectFalse<
  Assignable<{ as: 'section'; ref: (element: HTMLButtonElement) => void }, BadgeProps<'section'>>
>;

/** Receive the selected native section through Badge's public ref. */
function receiveSection(element: HTMLElement): void {
  element.dataset.badgeRef = 'section';
}

/** Compile the published Badge and provider surface together. */
export function typedBadge(): JSX.Element {
  return (
    <BadgePropsProvider value={{ size: 'lg', variant: 'outline' }}>
      <Badge as="section" ref={receiveSection} colorPalette="blue">
        Reviewed
      </Badge>
    </BadgePropsProvider>
  );
}

/** Compile an explicitly undefined `unstyled` value on Badge and its provider. */
export function typedOptionalBadge(unstyled: boolean | undefined): JSX.Element {
  return (
    <BadgePropsProvider value={{ unstyled }}>
      <Badge unstyled={unstyled}>Optional</Badge>
    </BadgePropsProvider>
  );
}
