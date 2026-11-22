import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CalendarIcon } from '@lucide/solid';
import { DateInput, DatePicker, Portal } from '../../src';
import './date-input-examples.css';

/** Synchronize a segmented date editor with the popup calendar. */
export function DateInputWithDatePicker(): JSX.Element {
  const [value, setValue] = createSignal<DateInput.DateValue[]>([]);

  /** Apply a date selected through either the editor or calendar. */
  function updateValue(details: DateInput.ValueChangeDetails): void {
    setValue(details.value);
  }

  const dateInput = DateInput.useDateInput(
    /** Read the latest shared date whenever the machine refreshes. */
    () => ({ value: value(), onValueChange: updateValue }),
  );

  return (
    <DatePicker.Root value={value()} onValueChange={updateValue} class="example-date-input">
      <DateInput.RootProvider value={dateInput}>
        <DateInput.Label>Date of birth</DateInput.Label>
        <DatePicker.Control>
          <DateInput.Control style={{ flex: '1' }}>
            <DateInput.Segments />
          </DateInput.Control>
          <DatePicker.IndicatorGroup>
            <DatePicker.Trigger>
              <CalendarIcon />
            </DatePicker.Trigger>
          </DatePicker.IndicatorGroup>
        </DatePicker.Control>
        <DateInput.HiddenInput />
      </DateInput.RootProvider>
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
