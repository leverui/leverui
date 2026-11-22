import { InputAddon, type InputAddonProps } from '@leverui/components';

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

export type InputAddonSizeAccepted = ExpectTrue<Assignable<{ size: 'lg' }, InputAddonProps>>;
export type InputAddonVariantAccepted = ExpectTrue<
  Assignable<{ variant: 'flushed' }, InputAddonProps>
>;
export type InvalidInputAddonSizeRejected = ExpectFalse<
  Assignable<{ size: 'huge' }, InputAddonProps>
>;
export type InputAddonCssObjectRejected = ExpectFalse<
  Assignable<{ css: { bg: 'red' } }, InputAddonProps>
>;
export type ButtonRefWithoutButtonElementRejected = ExpectFalse<
  Assignable<{ ref: (element: HTMLButtonElement) => void }, InputAddonProps<'button'>>
>;
export type ButtonRefWithButtonElementAccepted = ExpectTrue<
  Assignable<{ as: 'button'; ref: (element: HTMLButtonElement) => void }, InputAddonProps<'button'>>
>;

/** Receive the native div provided by the installed addon. */
function captureAddon(element: HTMLDivElement): void {
  element.dataset.captured = 'true';
}

/** Receive the selected button from the installed addon. */
function captureButtonAddon(element: HTMLButtonElement): void {
  element.dataset.captured = 'true';
}

export const nativeAddon = (
  <InputAddon ref={captureAddon} size="sm" variant="outline">
    Prefix
  </InputAddon>
);

export const buttonAddon = (
  <InputAddon as="button" ref={captureButtonAddon} type="button">
    Action
  </InputAddon>
);
