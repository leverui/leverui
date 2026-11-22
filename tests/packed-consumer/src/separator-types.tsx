import { Separator, type SeparatorProps } from '@leverui/components';
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

export type SizeAccepted = ExpectTrue<Assignable<{ size: 'lg' }, SeparatorProps>>;
export type ResponsiveOrientationAccepted = ExpectTrue<
  Assignable<{ orientation: { base: 'vertical'; md: 'horizontal' } }, SeparatorProps>
>;
export type CssObjectRejected = ExpectFalse<
  Assignable<{ css: { borderColor: string } }, SeparatorProps>
>;
export type HeightShorthandRejected = ExpectFalse<Assignable<{ height: '4' }, SeparatorProps>>;
export type FlexShorthandRejected = ExpectFalse<Assignable<{ flex: '1' }, SeparatorProps>>;
export type SelectedTagAccepted = ExpectTrue<
  Assignable<{ as: 'div'; ref: (element: HTMLDivElement) => void }, SeparatorProps<'div'>>
>;

/** Compile native selected-tag and style props from the packed package. */
export function typedSeparator(): JSX.Element {
  return <Separator as="div" orientation="vertical" style={{ height: '24px' }} />;
}
