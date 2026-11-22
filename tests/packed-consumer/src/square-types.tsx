import { Square, type SquareProps } from '@leverui/components';
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
  Assignable<{ as: 'a'; href: string; size: string; children: JSX.Element }, SquareProps<'a'>>
>;
export type ResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ size: { base: string; md: string } }, SquareProps>
>;
export type NativeInputResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ as: 'input'; size: { base: string; md: string } }, SquareProps<'input'>>
>;
export type NativeSelectResponsiveSizeAccepted = ExpectTrue<
  Assignable<{ as: 'select'; size: { base: string; md: string } }, SquareProps<'select'>>
>;
export type BooleanSizeRejected = ExpectFalse<Assignable<{ size: boolean }, SquareProps>>;
export type CssObjectRejected = ExpectFalse<
  Assignable<{ css: { background: string } }, SquareProps>
>;
export type GeneralStylePropRejected = ExpectFalse<Assignable<{ bg: string }, SquareProps>>;
export type WrongAnchorRefRejected = ExpectFalse<
  Assignable<{ as: 'a'; ref: (element: HTMLButtonElement) => void }, SquareProps<'a'>>
>;

/** Receive the selected native anchor through the installed declaration. */
function receiveAnchor(element: HTMLAnchorElement): void {
  element.dataset.squareRef = 'anchor';
}

export const anchor = (
  <Square as="a" href="/docs" ref={receiveAnchor} size="10">
    Square docs
  </Square>
);

export const input = <Square as="input" type="text" size={{ base: '8', md: '12' }} />;
