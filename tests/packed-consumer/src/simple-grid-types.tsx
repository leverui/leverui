import { SimpleGrid, type SimpleGridProps } from '@leverui/components';
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

export type ResponsiveColumnsAccepted = ExpectTrue<
  Assignable<{ columns: { base: 2; md: 4 } }, SimpleGridProps<'div'>>
>;
export type MinimumWidthAccepted = ExpectTrue<
  Assignable<{ minChildWidth: ['24', null, '100px'] }, SimpleGridProps<'div'>>
>;
export type SkippedWidthAccepted = ExpectTrue<
  Assignable<{ minChildWidth: ['100px', undefined, '140px'] }, SimpleGridProps<'div'>>
>;
export type NativeSectionAccepted = ExpectTrue<
  Assignable<{ as: 'section'; children: JSX.Element }, SimpleGridProps<'section'>>
>;
export type InvalidColumnsRejected = ExpectFalse<
  Assignable<{ columns: 'three' }, SimpleGridProps<'div'>>
>;
export type ObjectCssRejected = ExpectFalse<
  Assignable<{ css: { gridTemplateColumns: string } }, SimpleGridProps<'div'>>
>;
export type WidthStylePropRejected = ExpectFalse<
  Assignable<{ width: string }, SimpleGridProps<'div'>>
>;
export type NativeStyleAccepted = ExpectTrue<
  Assignable<{ style: { width: string } }, SimpleGridProps<'div'>>
>;
export type WrongRefRejected = ExpectFalse<
  Assignable<{ as: 'button'; ref: (element: HTMLAnchorElement) => void }, SimpleGridProps<'button'>>
>;

/** Receive the selected native button from the installed declaration. */
function receiveButton(element: HTMLButtonElement): void {
  element.dataset.gridRef = 'button';
}

export const nativeGrid = (
  <SimpleGrid as="button" type="button" ref={receiveButton} columns={2}>
    Typed grid
  </SimpleGrid>
);
