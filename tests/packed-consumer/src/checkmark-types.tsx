import { Checkmark, type CheckmarkProps } from '@leverui/components';
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

export type CheckedAccepted = ExpectTrue<Assignable<{ checked: boolean }, CheckmarkProps<'svg'>>>;
export type IndeterminateAccepted = ExpectTrue<
  Assignable<{ indeterminate: boolean; disabled: boolean }, CheckmarkProps<'svg'>>
>;
export type InvalidVariantRejected = ExpectFalse<
  Assignable<{ variant: 'glowing' }, CheckmarkProps<'svg'>>
>;
export type ResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ size: { base: 'xs'; md: 'lg' } }, CheckmarkProps<'svg'>>
>;
export type SvgRefAccepted = ExpectTrue<
  Assignable<{ ref: (element: SVGSVGElement) => void }, CheckmarkProps<'svg'>>
>;
export type WrongSvgRefRejected = ExpectFalse<
  Assignable<{ ref: (element: HTMLSpanElement) => void }, CheckmarkProps<'svg'>>
>;
export type SelectedSpanRefAccepted = ExpectTrue<
  Assignable<{ as: 'span'; ref: (element: HTMLSpanElement) => void }, CheckmarkProps<'span'>>
>;
export type WrongSpanRefRejected = ExpectFalse<
  Assignable<{ as: 'span'; ref: (element: SVGSVGElement) => void }, CheckmarkProps<'span'>>
>;
export type ObjectCssRejected = ExpectFalse<
  'css' extends keyof CheckmarkProps<'svg'> ? true : false
>;
export type RecipeRejected = ExpectFalse<
  'recipe' extends keyof CheckmarkProps<'svg'> ? true : false
>;
export type StylePropRejected = ExpectFalse<
  'boxSize' extends keyof CheckmarkProps<'svg'> ? true : false
>;
export type ResponsiveFilledAccepted = ExpectTrue<
  Assignable<{ filled: { base: true; md: false } }, CheckmarkProps<'svg'>>
>;

/** Receive the native SVG through the installed package's public ref. */
function receiveSvg(element: SVGSVGElement): void {
  element.dataset.typedCheckmark = 'svg';
}

/** Compile native state and finite CSS choices from the installed declaration. */
export function typedCheckmark(): JSX.Element {
  return <Checkmark checked variant="outline" size="lg" ref={receiveSvg} aria-label="Ready" />;
}
