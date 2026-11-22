import { Input, InputGroup, type InputGroupProps } from '@leverui/components';
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
type WithChild<Props> = Props & { children: JSX.Element };

export type StartOffsetAccepted = ExpectTrue<
  Assignable<WithChild<{ startOffset: '2px' }>, InputGroupProps>
>;
export type ElementPropsAccepted = ExpectTrue<
  Assignable<WithChild<{ endElementProps: { placement: 'end' } }>, InputGroupProps>
>;
export type InvalidElementPlacementRejected = ExpectFalse<
  Assignable<WithChild<{ endElementProps: { placement: 'middle' } }>, InputGroupProps>
>;
export type ButtonRefWithoutSelectionRejected = ExpectFalse<
  Assignable<WithChild<{ ref: (element: HTMLButtonElement) => void }>, InputGroupProps<'button'>>
>;
export type ButtonRefWithSelectionAccepted = ExpectTrue<
  Assignable<
    WithChild<{ as: 'button'; ref: (element: HTMLButtonElement) => void }>,
    InputGroupProps<'button'>
  >
>;
export type ResponsiveOffsetAccepted = ExpectTrue<
  Assignable<WithChild<{ startOffset: { base: '0px'; md: '2px' } }>, InputGroupProps>
>;

/** Receive the default group div from an installed package. */
function captureGroup(element: HTMLDivElement): void {
  element.dataset.captured = 'true';
}

export const nativeGroup = (
  <InputGroup startElement="@" ref={captureGroup}>
    <Input aria-label="Username" />
  </InputGroup>
);
