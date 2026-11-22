import { Grid, GridItem, type GridItemProps, type GridProps } from '@leverui/components';
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

export type NativeGridAccepted = ExpectTrue<
  Assignable<
    { as: 'section'; templateColumns: string; children: JSX.Element },
    GridProps<'section'>
  >
>;
export type ResponsiveGridAccepted = ExpectTrue<
  Assignable<{ templateColumns: { base: string; md: string } }, GridProps>
>;
export type ResponsiveSpanAccepted = ExpectTrue<
  Assignable<{ colSpan: { base: 1; md: 2 } }, GridItemProps>
>;
export type InvalidInlineRejected = ExpectFalse<Assignable<{ inline: string }, GridProps>>;
export type InvalidSpanRejected = ExpectFalse<Assignable<{ colSpan: 'two' }, GridItemProps>>;
export type ObjectCssRejected = ExpectFalse<
  Assignable<{ css: { gridTemplateColumns: string } }, GridProps>
>;
export type GapPropRejected = ExpectFalse<Assignable<{ gap: string }, GridProps>>;
export type ItemStylePropRejected = ExpectFalse<Assignable<{ bg: string }, GridItemProps>>;
export type NativeStyleAccepted = ExpectTrue<Assignable<{ style: { gap: string } }, GridProps>>;
export type WrongItemRefRejected = ExpectFalse<
  Assignable<{ as: 'button'; ref: (element: HTMLAnchorElement) => void }, GridItemProps<'button'>>
>;

/** Receive the selected native section through the installed Grid declaration. */
function receiveSection(element: HTMLElement): void {
  element.dataset.gridRef = 'section';
}

/** Receive the selected native button through the installed GridItem declaration. */
function receiveButton(element: HTMLButtonElement): void {
  element.dataset.gridItemRef = 'button';
}

export const nativeGrid = (
  <Grid as="section" ref={receiveSection} templateColumns="40px 40px">
    <GridItem as="button" type="button" ref={receiveButton} colSpan={2}>
      Native grid item
    </GridItem>
  </Grid>
);
