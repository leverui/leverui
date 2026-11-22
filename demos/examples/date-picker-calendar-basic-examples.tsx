import { isWeekend, parseDate } from '@internationalized/date';
import { type JSX } from '@solidjs/web';
import { CalendarExample } from './date-picker-calendar-common';

/** Show the inline day, month, and year calendar. */
export function DatePickerCalendarBasic(): JSX.Element {
  return <CalendarExample />;
}

/** Hide the date cells from adjacent months. */
export function DatePickerCalendarHideOutsideDays(): JSX.Element {
  return (
    <CalendarExample
      rootProps={{ hideOutsideDays: true, defaultValue: [parseDate('2025-03-15')] }}
    />
  );
}

/** Start the inline calendar on March 15, 2025. */
export function DatePickerCalendarDefaultValue(): JSX.Element {
  return <CalendarExample rootProps={{ defaultValue: [parseDate('2025-03-15')] }} />;
}

/** Select a contiguous trip range from the inline calendar. */
export function DatePickerCalendarRangeSelection(): JSX.Element {
  return <CalendarExample rootProps={{ selectionMode: 'range' }} />;
}

/** Select several independent calendar dates. */
export function DatePickerCalendarMultiSelection(): JSX.Element {
  return <CalendarExample rootProps={{ selectionMode: 'multiple' }} />;
}

/** Restrict selectable dates to March 5–25, 2025. */
export function DatePickerCalendarMinMax(): JSX.Element {
  return (
    <CalendarExample rootProps={{ min: parseDate('2025-03-05'), max: parseDate('2025-03-25') }} />
  );
}

/** Prevent weekend selection in the calendar. */
export function DatePickerCalendarUnavailableDates(): JSX.Element {
  return <CalendarExample rootProps={{ isDateUnavailable: isWeekend }} />;
}

/** Start German calendar weeks on Monday. */
export function DatePickerCalendarLocale(): JSX.Element {
  return <CalendarExample rootProps={{ locale: 'de-DE', startOfWeek: 1 }} />;
}

/** Limit independent selection to three dates. */
export function DatePickerCalendarMaxSelected(): JSX.Element {
  return <CalendarExample rootProps={{ selectionMode: 'multiple', maxSelectedDates: 3 }} />;
}

/** Include week-number cells alongside the day grid. */
export function DatePickerCalendarWeekNumbers(): JSX.Element {
  return <CalendarExample rootProps={{ showWeekNumbers: true }} />;
}
