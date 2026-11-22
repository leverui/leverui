import {
  Loader,
  LoaderOverlay,
  type LoaderOverlayProps,
  type LoaderProps,
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

export type LoaderVisibleAccepted = ExpectTrue<Assignable<{ visible: false }, LoaderProps>>;
export type InvalidPlacementRejected = ExpectFalse<
  Assignable<{ spinnerPlacement: 'middle' }, LoaderProps>
>;
export type OverlayNativeAsAccepted = ExpectTrue<Assignable<{ as: 'section' }, LoaderOverlayProps>>;
export type LoaderCssRejected = ExpectFalse<'css' extends keyof LoaderProps ? true : false>;
export type LoaderStylePropRejected = ExpectFalse<
  'textStyle' extends keyof LoaderProps ? true : false
>;
export type OverlayCssRejected = ExpectFalse<'css' extends keyof LoaderOverlayProps ? true : false>;
export type OverlayStylePropRejected = ExpectFalse<
  'bg' extends keyof LoaderOverlayProps ? true : false
>;

/** Receive the native div selected by Loader's polymorphic prop. */
function receiveLoaderDiv(element: HTMLDivElement): void {
  element.dataset.loaderRef = 'div';
}

/** Receive the native section selected by LoaderOverlay. */
function receiveOverlaySection(element: HTMLElement): void {
  element.dataset.overlayRef = 'section';
}

export const nativeLoader = <Loader as="div" ref={receiveLoaderDiv} text="Working" />;
export const nativeOverlay = <LoaderOverlay as="section" ref={receiveOverlaySection} />;
export const bypassedLoader = <Loader visible={false}>Ready</Loader>;
