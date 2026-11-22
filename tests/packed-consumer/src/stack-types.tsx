import {
  HStack,
  Stack,
  StackSeparator,
  VStack,
  type StackProps,
  type StackSeparatorRenderProps,
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

export type ResponsiveDirectionAccepted = ExpectTrue<
  Assignable<{ direction: { base: 'column'; md: 'row' } }, StackProps>
>;
export type ResponsiveGapAccepted = ExpectTrue<Assignable<{ gap: ['2', null, '4'] }, StackProps>>;
export type NativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { padding: string } }, StackProps>
>;
export type CssObjectRejected = ExpectFalse<
  Assignable<{ css: { background: string } }, StackProps>
>;
export type PaddingPropRejected = ExpectFalse<Assignable<{ p: string }, StackProps>>;
export type SeparatorCssRejected = ExpectFalse<
  Assignable<{ css: { borderColor: string } }, StackSeparatorRenderProps>
>;
export type SeparatorClassAccepted = ExpectTrue<
  Assignable<{ class: string }, StackSeparatorRenderProps>
>;
export type WrongRefRejected = ExpectFalse<
  Assignable<{ as: 'button'; ref: (element: HTMLAnchorElement) => void }, StackProps<'button'>>
>;

/** Receive a native button through the installed declaration. */
function receiveButton(element: HTMLButtonElement): void {
  element.dataset.stackRef = 'button';
}

/** Render one custom separator from the class-only renderer contract. */
function renderSeparator(props: StackSeparatorRenderProps): JSX.Element {
  return <StackSeparator {...props} />;
}

export const typedStack = (
  <Stack as="button" type="button" ref={receiveButton} separator={renderSeparator}>
    Native stack
  </Stack>
);
export const typedHStack = <HStack gap="2">Horizontal</HStack>;
export const typedVStack = <VStack gap="2">Vertical</VStack>;
