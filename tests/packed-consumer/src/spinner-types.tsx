import {
  Spinner,
  SpinnerPropsProvider,
  type SpinnerProps,
  type SpinnerPropsProviderProps,
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
type ProviderDefaults = Exclude<SpinnerPropsProviderProps['value'], (...args: never[]) => unknown>;

export type SpinnerMediumAccepted = ExpectTrue<Assignable<{ size: 'md' }, SpinnerProps>>;
export type InvalidSpinnerSizeRejected = ExpectFalse<Assignable<{ size: '2xl' }, SpinnerProps>>;
export type SpinnerCssObjectRejected = ExpectFalse<'css' extends keyof SpinnerProps ? true : false>;
export type SpinnerRecipeRejected = ExpectFalse<'recipe' extends keyof SpinnerProps ? true : false>;
export type SpinnerToneRejected = ExpectFalse<'tone' extends keyof SpinnerProps ? true : false>;
export type SpinnerClassNameAccepted = ExpectTrue<Assignable<{ className: string }, SpinnerProps>>;
export type SpinnerResponsiveAccepted = ExpectTrue<
  Assignable<{ size: { base: 'sm'; md: 'xl' } }, SpinnerProps>
>;
export type ProviderRefRejected = ExpectFalse<'ref' extends keyof ProviderDefaults ? true : false>;
export type ProviderAsRejected = ExpectFalse<'as' extends keyof ProviderDefaults ? true : false>;
export type SpinnerSvgRefAccepted = ExpectTrue<
  Assignable<{ as: 'svg'; ref: (element: SVGSVGElement) => void }, SpinnerProps<'svg'>>
>;

/** Receive the div selected by Spinner's explicit polymorphic prop. */
function receiveDiv(element: HTMLDivElement): void {
  element.dataset.spinnerRef = 'div';
}

/** Receive a consumer-owned SVG indicator through its selected ref. */
function receiveSvg(element: SVGSVGElement): void {
  element.dataset.spinnerRef = 'svg';
}

export const styled = <Spinner class="consumer-spinner" />;
export const responsive = <Spinner size={{ base: 'sm', md: 'xl' }} />;
export const nativeDiv = <Spinner as="div" ref={receiveDiv} />;
export const svgIndicator = (
  <Spinner as="svg" viewBox="0 0 24 24" ref={receiveSvg}>
    <path d="M12 2v4" />
  </Spinner>
);
export const defaults = (
  <SpinnerPropsProvider value={{ class: 'provider-spinner', size: 'lg' }}>
    <Spinner />
  </SpinnerPropsProvider>
);
