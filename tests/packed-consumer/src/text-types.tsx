import {
  Text,
  TextPropsProvider,
  type TextProps,
  type TextPropsProviderProps,
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
type ExpectFalse<Value extends false> = Value;
type ProviderDefaults = TextPropsProviderProps['value'];

export type TextObjectCssRejected = ExpectFalse<'css' extends keyof TextProps ? true : false>;
export type TextRecipeRejected = ExpectFalse<'recipe' extends keyof TextProps ? true : false>;
export type TextStylePropRejected = ExpectFalse<
  'fontWeight' extends keyof TextProps ? true : false
>;
export type TextColorPropRejected = ExpectFalse<'color' extends keyof TextProps ? true : false>;
export type ConditionalClampRejected = ExpectFalse<Assignable<{ lineClamp: { md: 2 } }, TextProps>>;
export type SpanRefWithoutAsRejected = ExpectFalse<
  Assignable<{ ref: (element: HTMLSpanElement) => void }, TextProps<'span'>>
>;
export type ProviderRefRejected = ExpectFalse<'ref' extends keyof ProviderDefaults ? true : false>;
export type ProviderAsRejected = ExpectFalse<'as' extends keyof ProviderDefaults ? true : false>;
export type ProviderAsChildRejected = ExpectFalse<
  'asChild' extends keyof ProviderDefaults ? true : false
>;

/** Receive the span selected by Text's explicit polymorphic prop. */
function receiveSpan(element: HTMLSpanElement): void {
  element.dataset.textRef = 'span';
}

export const customTone = (
  <Text style={{ color: 'var(--lui-colors-blue-500)' }}>Consumer styled text</Text>
);
export const span = (
  <Text as="span" ref={receiveSpan}>
    Inline text
  </Text>
);
export const defaults = (
  <TextPropsProvider value={{ style: { color: 'var(--lui-colors-fg-muted)' } }}>
    <Text>Muted text</Text>
  </TextPropsProvider>
);
