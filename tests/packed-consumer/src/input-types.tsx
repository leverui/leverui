import {
  Input,
  InputPropsProvider,
  type InputProps,
  type InputPropsProviderProps,
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
type ExpectTrue<Value extends true> = Value;
type ExpectFalse<Value extends false> = Value;
type ProviderDefaults = InputPropsProviderProps['value'];

export type InputSizeAccepted = ExpectTrue<Assignable<{ size: 'lg' }, InputProps>>;
export type InvalidInputSizeRejected = ExpectFalse<Assignable<{ size: 'huge' }, InputProps>>;
export type InputCssObjectRejected = ExpectFalse<Assignable<{ css: { bg: 'red' } }, InputProps>>;
export type InputStylePropRejected = ExpectFalse<Assignable<{ ps: '4' }, InputProps>>;
export type InputDefaultValueAccepted = ExpectTrue<
  Assignable<{ defaultValue: string }, InputProps>
>;
export type ProviderRefRejected = ExpectFalse<'ref' extends keyof ProviderDefaults ? true : false>;
export type ProviderAsRejected = ExpectFalse<'as' extends keyof ProviderDefaults ? true : false>;

/** Receive the native textarea chosen by an Input consumer. */
function receiveTextarea(element: HTMLTextAreaElement): void {
  element.dataset.inputRef = 'textarea';
}

/** Accept a native Solid input event in a consuming package. */
function handleInput(event: InputEvent & { currentTarget: HTMLInputElement }): void {
  event.currentTarget.dataset.handled = 'true';
}

export const controlled = <Input value="current" onInput={handleInput} />;
export const uncontrolled = <Input defaultValue="draft" />;
export const selectedElement = <Input as="textarea" ref={receiveTextarea} />;
export const defaults = (
  <InputPropsProvider value={{ size: 'lg', variant: 'outline' }}>
    <Input aria-label="Account name" />
  </InputPropsProvider>
);
