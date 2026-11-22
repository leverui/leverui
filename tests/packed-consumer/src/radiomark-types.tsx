import { Radiomark, type RadiomarkProps } from '@leverui/components';
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

export type SizeAccepted = ExpectTrue<Assignable<{ size: 'lg' }, RadiomarkProps>>;
export type ResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ size: { base: 'xs'; md: 'lg' } }, RadiomarkProps>
>;
export type InvalidSizeRejected = ExpectFalse<Assignable<{ size: 'huge' }, RadiomarkProps>>;
export type VariantAccepted = ExpectTrue<
  Assignable<{ variant: 'outline'; filled: true }, RadiomarkProps>
>;
export type CheckedAccepted = ExpectTrue<Assignable<{ checked: true }, RadiomarkProps>>;
export type NativeClassAccepted = ExpectTrue<
  Assignable<{ className: 'custom-mark' }, RadiomarkProps>
>;
export type ObjectCssRejected = ExpectFalse<
  'css' extends keyof RadiomarkProps<'span'> ? true : false
>;
export type CustomRecipeRejected = ExpectFalse<
  'recipe' extends keyof RadiomarkProps<'span'> ? true : false
>;
export type StylePropRejected = ExpectFalse<
  'marginTop' extends keyof RadiomarkProps<'span'> ? true : false
>;
export type SpanRefAccepted = ExpectTrue<
  Assignable<{ ref: (element: HTMLSpanElement) => void }, RadiomarkProps<'span'>>
>;
export type SelectedTagAccepted = ExpectTrue<
  Assignable<{ as: 'div'; ref: (element: HTMLDivElement) => void }, RadiomarkProps<'div'>>
>;

/** Compile an installed Radiomark against its public declarations. */
export function typedRadiomark(): JSX.Element {
  return <Radiomark checked variant="outline" filled colorPalette="teal" size="lg" />;
}
