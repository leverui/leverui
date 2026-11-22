import { Sticky, type StickyProps } from '@leverui/components';

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

export type NativeNavAccepted = ExpectTrue<
  Assignable<{ as: 'nav'; 'aria-label': string }, StickyProps<'nav'>>
>;
export type CssObjectRejected = ExpectFalse<Assignable<{ css: { top: string } }, StickyProps>>;
export type GeneralStylePropRejected = ExpectFalse<Assignable<{ top: string }, StickyProps>>;
export type WrongNavRefRejected = ExpectFalse<
  Assignable<{ as: 'nav'; ref: (element: HTMLButtonElement) => void }, StickyProps<'nav'>>
>;

/** Receive the selected navigation element from the package type. */
function receiveNav(element: HTMLElement): void {
  element.dataset.stickyRef = 'nav';
}

export const nativeSticky = (
  <Sticky as="nav" aria-label="Page sections" ref={receiveNav} style={{ top: '16px' }} />
);
