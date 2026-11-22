import { parseDate } from '@internationalized/date';
import {
  DatePicker,
  DatePickerDayTable,
  DatePickerRangeText,
  DatePickerRoot,
  DatePickerTable,
  DatePickerTableCell,
  useDatePicker,
  useDatePickerContext,
  type DatePickerDateView,
  type DatePickerRangeTextProps,
  type DatePickerRootProps,
  type DatePickerRootProviderBaseProps,
  type DatePickerValueChangeDetails,
  type UseDatePickerProps,
  type UseDatePickerReturn,
} from '@leverui/components';
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

export type DateValueAccepted = ExpectTrue<
  Assignable<{ defaultValue: ReturnType<typeof parseDate>[] }, UseDatePickerProps>
>;
export type InvalidDateRejected = ExpectFalse<
  Assignable<{ defaultValue: string }, UseDatePickerProps>
>;
export type NativeRootAccepted = ExpectTrue<
  Assignable<{ size: 'sm'; variant: 'outline'; title: string }, DatePickerRootProps>
>;
export type DatePickerObjectCssRemoved = ExpectFalse<
  'css' extends keyof DatePickerRootProps ? true : false
>;
export type DatePickerRecipeRemoved = ExpectFalse<
  'recipe' extends keyof DatePickerRootProps ? true : false
>;
export type DatePickerStylePropRemoved = ExpectFalse<
  'bg' extends keyof DatePickerRootProps ? true : false
>;
export type DivRangeTextAccepted = ExpectTrue<
  Assignable<{ title: string; htmlTranslate: 'no' }, DatePickerRangeTextProps>
>;

/** Compose named calendar parts against the installed public declarations. */
function NamedCalendar(): JSX.Element {
  const machine = useDatePickerContext();
  return (
    <>
      <output>{machine().view}</output>
      <DatePicker.Header />
      <DatePickerTable columns={7} aria-label="Manual calendar grid">
        <DatePicker.TableBody>
          <DatePicker.TableRow>
            <DatePickerTableCell value={parseDate('2026-03-14')} columns={7}>
              <DatePicker.TableCellTrigger>14</DatePicker.TableCellTrigger>
            </DatePickerTableCell>
          </DatePicker.TableRow>
        </DatePicker.TableBody>
      </DatePickerTable>
      <DatePickerDayTable offset={1} />
    </>
  );
}

/** Compile the named and compound roots, external machine, refs, and custom child. */
export function PackedDatePickerTypes(): JSX.Element {
  /** Accept the public value callback payload without replacing its date type. */
  function recordValue(details: DatePickerValueChangeDetails): void {
    if (details.value.length === 0) return;
  }

  /** Check the default RangeText ref's native div element. */
  function captureRange(element: HTMLDivElement): void {
    element.dataset.packedRange = 'true';
  }

  /** Keep the primitive's root props on a caller-rendered section. */
  const renderRoot: NonNullable<DatePicker.RootProviderProps['asChild']> = (getProps) => (
    <section {...getProps()} />
  );

  const machine: UseDatePickerReturn = useDatePicker({
    defaultValue: [parseDate('2026-03-14')],
    onValueChange: recordValue,
  });
  const providerBase: DatePickerRootProviderBaseProps = {
    value: machine,
    asChild: renderRoot,
  };
  const view: DatePickerDateView = 'day';

  return (
    <>
      <DatePicker.PropsProvider value={{ size: 'sm', variant: 'outline' }}>
        <DatePicker.RootProvider {...providerBase}>
          <DatePicker.Label>Packed calendar</DatePicker.Label>
          <DatePicker.Control>
            <DatePicker.Input htmlTranslate="no" />
          </DatePicker.Control>
          <DatePicker.Content>
            <DatePicker.View view={view}>
              <DatePickerRangeText ref={captureRange} title="Current month" />
              <NamedCalendar />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.RootProvider>
        <DatePickerRoot defaultValue={[parseDate('2026-04-05')]} size="lg">
          <DatePicker.Label>Second calendar</DatePicker.Label>
          <DatePicker.Control>
            <DatePicker.Input />
          </DatePicker.Control>
        </DatePickerRoot>
      </DatePicker.PropsProvider>
    </>
  );
}
