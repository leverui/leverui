import { InputElement, type InputElementProps } from '@leverui/components';

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

export type StartPlacementAccepted = ExpectTrue<
  Assignable<{ placement: 'start' }, InputElementProps>
>;
export type EndPlacementAccepted = ExpectTrue<Assignable<{ placement: 'end' }, InputElementProps>>;
export type ResponsivePlacementAccepted = ExpectTrue<
  Assignable<{ placement: { base: 'start'; md: 'end' } }, InputElementProps>
>;
export type InvalidPlacementRejected = ExpectFalse<
  Assignable<{ placement: 'middle' }, InputElementProps>
>;
export type CssObjectRejected = ExpectFalse<Assignable<{ css: { top: 0 } }, InputElementProps>>;
export type GeneralStylePropRejected = ExpectFalse<
  Assignable<{ pointerEvents: 'none' }, InputElementProps>
>;
export type ButtonRefWithoutSelectionRejected = ExpectFalse<
  Assignable<{ ref: (element: HTMLButtonElement) => void }, InputElementProps<'button'>>
>;
export type ButtonRefWithSelectionAccepted = ExpectTrue<
  Assignable<
    { as: 'button'; ref: (element: HTMLButtonElement) => void },
    InputElementProps<'button'>
  >
>;

/** Receive a div from the installed package. */
function captureElement(element: HTMLDivElement): void {
  element.dataset.captured = 'true';
}

export const nativeElement = (
  <InputElement placement="start" ref={captureElement}>
    $
  </InputElement>
);
