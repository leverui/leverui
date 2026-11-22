import { CalendarDate } from '@internationalized/date';
import { type JSX } from '@solidjs/web';
import { CalendarIcon } from '@lucide/solid';
import { DatePicker, Portal } from '../../src';

/** Format a month selection as MM/YYYY. */
function formatMonth(date: DatePicker.DateValue): string {
  return `${String(date.month).padStart(2, '0')}/${date.year}`;
}

/** Parse a complete month and year into the first day of that month. */
function parseMonth(value: string): CalendarDate | undefined {
  const match = /^(\d{1,2})\/(\d{4})$/.exec(value);
  if (!match) return undefined;
  const month = Number(match[1]);
  if (month < 1 || month > 12) return undefined;
  return new CalendarDate(Number(match[2]), month, 1);
}

/** Format a year selection with no month or day. */
function formatYear(date: DatePicker.DateValue): string {
  return String(date.year);
}

/** Expand a short year into the current century for a single-year field. */
function parseShortYear(value: string): CalendarDate | undefined {
  if (!/^\d{1,4}$/.test(value)) return undefined;
  const parsed = Number(value);
  const century = Math.floor(new Date().getFullYear() / 100) * 100;
  return new CalendarDate(parsed < 100 ? century + parsed : parsed, 1, 1);
}

/** Require a four-digit year in the range field. */
function parseRangeYear(value: string): CalendarDate | undefined {
  return /^\d{4}$/.test(value) ? new CalendarDate(Number(value), 1, 1) : undefined;
}

/** Open directly to months and accept MM/YYYY input. */
export function DatePickerMonthPicker(): JSX.Element {
  return (
    <DatePicker.Root
      format={formatMonth}
      parse={parseMonth}
      defaultView="month"
      minView="month"
      placeholder="mm/yyyy"
      style={{ 'max-width': '20rem' }}
    >
      <DatePicker.Label>Select month</DatePicker.Label>
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

/** Select a start and end month in two MM/YYYY fields. */
export function DatePickerMonthRange(): JSX.Element {
  return (
    <DatePicker.Root
      selectionMode="range"
      defaultView="month"
      minView="month"
      format={formatMonth}
      parse={parseMonth}
      placeholder="mm/yyyy"
      style={{ 'max-width': '20rem' }}
    >
      <DatePicker.Label>Select range</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Input index={0} />
        <DatePicker.Input index={1} />
        <DatePicker.IndicatorGroup>
          <DatePicker.Trigger>
            <CalendarIcon />
          </DatePicker.Trigger>
        </DatePicker.IndicatorGroup>
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
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

/** Open directly to a single year with short-year input support. */
export function DatePickerYearPicker(): JSX.Element {
  return (
    <DatePicker.Root
      format={formatYear}
      parse={parseShortYear}
      defaultView="year"
      minView="year"
      placeholder="yyyy"
      style={{ 'max-width': '20rem' }}
    >
      <DatePicker.Label>Select year</DatePicker.Label>
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

/** Select two full years for a year range. */
export function DatePickerYearRange(): JSX.Element {
  return (
    <DatePicker.Root
      selectionMode="range"
      defaultView="year"
      minView="year"
      format={formatYear}
      parse={parseRangeYear}
      placeholder="yyyy"
      style={{ 'max-width': '20rem' }}
    >
      <DatePicker.Label>Select year range</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Input index={0} />
        <DatePicker.Input index={1} />
        <DatePicker.IndicatorGroup>
          <DatePicker.Trigger>
            <CalendarIcon />
          </DatePicker.Trigger>
        </DatePicker.IndicatorGroup>
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
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
