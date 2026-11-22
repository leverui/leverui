import { Button, ButtonGroup, type ButtonGroupProps } from '@leverui/components';

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

export type ResponsiveLayoutAccepted = ExpectTrue<
  Assignable<
    { orientation: { base: 'horizontal'; md: 'vertical' }; attached: { base: true; md: false } },
    ButtonGroupProps
  >
>;
export type ColorPaletteAccepted = ExpectTrue<
  Assignable<{ colorPalette: 'teal' }, ButtonGroupProps>
>;
export type SectionRootAccepted = ExpectTrue<
  Assignable<{ as: 'section'; ref: (element: HTMLElement) => void }, ButtonGroupProps<'section'>>
>;
export type WrongSectionRefRejected = ExpectFalse<
  Assignable<
    { as: 'section'; ref: (element: HTMLButtonElement) => void },
    ButtonGroupProps<'section'>
  >
>;
export type ArbitraryGapRejected = ExpectFalse<Assignable<{ gap: '2' }, ButtonGroupProps>>;
export type CssObjectRejected = ExpectFalse<
  Assignable<{ css: { color: 'red' } }, ButtonGroupProps>
>;
export type RecipeObjectRejected = ExpectFalse<
  Assignable<{ recipe: { base: { color: 'red' } } }, ButtonGroupProps>
>;

export const styledGroup = (
  <ButtonGroup size="sm" variant="outline" class="consumer-actions" attached>
    <Button>Save</Button>
    <Button>Cancel</Button>
  </ButtonGroup>
);
