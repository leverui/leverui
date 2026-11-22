import { CalendarDate, PersianCalendar } from '@internationalized/date';
import { type JSX } from '@solidjs/web';
import { CalendarIcon } from '@lucide/solid';
import { DatePicker, Portal } from '../../src';

/** Format selected dates as DD/MM/YY. */
function formatShortDate(date: DatePicker.DateValue): string {
  const day = String(date.day).padStart(2, '0');
  const month = String(date.month).padStart(2, '0');
  const year = String(date.year % 100).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

/** Parse complete, month/day, and day-only input forms. */
function parseShortDate(value: string): CalendarDate | undefined {
  const complete = /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/.exec(value);
  const partial = /^(\d{1,2})\/(\d{1,2})$/.exec(value);
  const dayOnly = /^(\d{1,2})$/.exec(value);
  if (!complete && !partial && !dayOnly) return undefined;
  const day = Number(complete?.[1] ?? partial?.[1] ?? dayOnly?.[1]);
  const month = Number(complete?.[2] ?? partial?.[2] ?? 1);
  const year = complete ? 2000 + Number(complete[3]) : new Date().getFullYear();
  try {
    return new CalendarDate(year, month, day);
  } catch {
    return undefined;
  }
}

/** Support compact custom input parsing and formatting. */
export function DatePickerFormatParse(): JSX.Element {
  return (
    <DatePicker.Root
      format={formatShortDate}
      parse={parseShortDate}
      placeholder="dd/mm/yy"
      style={{ 'max-width': '20rem' }}
    >
      <DatePicker.Label>Invoice date</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Input />
        <DatePicker.IndicatorGroup>
          <DatePicker.Trigger>
            <CalendarIcon />
          </DatePicker.Trigger>
        </DatePicker.IndicatorGroup>
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.Header />
              <DatePicker.DayTable />
            </DatePicker.View>
            <DatePicker.View view="month">
              <DatePicker.Header />
              <DatePicker.MonthTable />
            </DatePicker.View>
            <DatePicker.View view="year">
              <DatePicker.Header />
              <DatePicker.YearTable />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  );
}

/** Use German date names and Monday-first weeks. */
export function DatePickerLocalization(): JSX.Element {
  return (
    <DatePicker.Root locale="de-DE" startOfWeek={1} style={{ 'max-width': '20rem' }}>
      <DatePicker.Label>Datum auswählen</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Input />
        <DatePicker.IndicatorGroup>
          <DatePicker.Trigger>
            <CalendarIcon />
          </DatePicker.Trigger>
        </DatePicker.IndicatorGroup>
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.Header />
              <DatePicker.DayTable />
            </DatePicker.View>
            <DatePicker.View view="month">
              <DatePicker.Header />
              <DatePicker.MonthTable />
            </DatePicker.View>
            <DatePicker.View view="year">
              <DatePicker.Header />
              <DatePicker.YearTable />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  );
}

/** Resolve the Persian calendar requested by the locale machine. */
function createPersianCalendar(identifier: string): PersianCalendar {
  if (identifier === 'persian') return new PersianCalendar();
  throw new Error(`Unsupported calendar: ${identifier}`);
}

/** Render the calendar in Persian with Saturday-first weeks. */
export function DatePickerPersianCalendar(): JSX.Element {
  return (
    <DatePicker.Root
      locale="fa-IR"
      createCalendar={createPersianCalendar}
      startOfWeek={6}
      style={{ 'max-width': '20rem' }}
    >
      <DatePicker.Label>تاریخ را انتخاب کنید</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Input />
        <DatePicker.IndicatorGroup>
          <DatePicker.Trigger>
            <CalendarIcon />
          </DatePicker.Trigger>
        </DatePicker.IndicatorGroup>
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.Header />
              <DatePicker.DayTable />
            </DatePicker.View>
            <DatePicker.View view="month">
              <DatePicker.Header />
              <DatePicker.MonthTable />
            </DatePicker.View>
            <DatePicker.View view="year">
              <DatePicker.Header />
              <DatePicker.YearTable />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  );
}
