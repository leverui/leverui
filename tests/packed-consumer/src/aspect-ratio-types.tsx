import { AspectRatio, type AspectRatioProps } from '@leverui/components';
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

export type NativeAnchorAccepted = ExpectTrue<
  Assignable<{ as: 'a'; href: string; ratio: number; children: JSX.Element }, AspectRatioProps<'a'>>
>;
export type TextRatioRejected = ExpectFalse<
  Assignable<{ ratio: string; children: JSX.Element }, AspectRatioProps>
>;
export type AspectRatioStylePropRejected = ExpectFalse<
  Assignable<{ aspectRatio: string; children: JSX.Element }, AspectRatioProps>
>;
export type GeneralWidthPropRejected = ExpectFalse<
  'width' extends keyof AspectRatioProps ? true : false
>;
export type CssObjectRejected = ExpectFalse<'css' extends keyof AspectRatioProps ? true : false>;
export type NativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { width: string }; children: JSX.Element }, AspectRatioProps>
>;
export type MissingChildRejected = ExpectFalse<Assignable<{ ratio: number }, AspectRatioProps>>;
export type WrongAnchorRefRejected = ExpectFalse<
  Assignable<
    { as: 'a'; ref: (element: HTMLButtonElement) => void; children: JSX.Element },
    AspectRatioProps<'a'>
  >
>;

/** Accept the selected native anchor through the installed component ref. */
function receiveAnchor(element: HTMLAnchorElement): void {
  element.dataset.ratioRef = 'anchor';
}

export const anchor = (
  <AspectRatio as="a" href="/docs" ref={receiveAnchor} ratio={16 / 9}>
    <span>Aspect ratio docs</span>
  </AspectRatio>
);
