import { parseDate } from '@internationalized/date';
import { type JSX } from '@solidjs/web';
import { CalendarIcon } from '@lucide/solid';
import { DatePicker, Portal } from '../../src';

/** Show two inputs for the start and end of a date range. */
export function DatePickerRangeSelection(): JSX.Element {
  return (
    <DatePicker.Root selectionMode="range" style={{ 'max-width': '20rem' }}>
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

/** Limit the date of creation to March 5–31, 2025. */
export function DatePickerMinMax(): JSX.Element {
  return (
    <DatePicker.Root
      min={parseDate('2025-03-05')}
      max={parseDate('2025-03-31')}
      style={{ 'max-width': '20rem' }}
    >
      <DatePicker.Label>Date of creation</DatePicker.Label>
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

/** Mark Saturdays and Sundays unavailable in the popup calendar. */
export function DatePickerUnavailableDates(): JSX.Element {
  /** Recognize weekends in the same UTC calendar. */
  function isWeekend(date: DatePicker.DateValue): boolean {
    const day = date.toDate('UTC').getDay();
    return day === 0 || day === 6;
  }

  return (
    <DatePicker.Root isDateUnavailable={isWeekend} style={{ 'max-width': '20rem' }}>
      <DatePicker.Label>Delivery date</DatePicker.Label>
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
