import { Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CalendarIcon } from '@lucide/solid';
import { DatePicker, HStack, Portal, Spacer } from '../../src';

/** Swap the calendar button for a clear action after selection. */
export function DatePickerClearIcon(): JSX.Element {
  return (
    <DatePicker.Root style={{ 'max-width': '20rem' }}>
      <DatePicker.Label>Date of birth</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Input />
        <DatePicker.IndicatorGroup>
          <DatePicker.Context>
            {
              /** Update with the machine's selected date count. */
              (context) => (
                <Show
                  when={context().value.length > 0}
                  fallback={
                    <DatePicker.Trigger>
                      <CalendarIcon />
                    </DatePicker.Trigger>
                  }
                >
                  <DatePicker.ClearTrigger />
                </Show>
              )
            }
          </DatePicker.Context>
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

/** Move month text before the previous and next actions. */
export function DatePickerHeaderLayout(): JSX.Element {
  return (
    <DatePicker.Root style={{ 'max-width': '20rem' }}>
      <DatePicker.Label>Date</DatePicker.Label>
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
              <HStack>
                <DatePicker.RangeText
                  style={{ 'padding-inline-start': 'var(--leverui-spacing-4)' }}
                />
                <Spacer />
                <DatePicker.PrevTrigger />
                <DatePicker.NextTrigger />
              </HStack>
              <DatePicker.DayTable />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  );
}

/** Navigate directly with native month and year selects. */
export function DatePickerMonthYearSelect(): JSX.Element {
  return (
    <DatePicker.Root style={{ 'max-width': '20rem' }}>
      <DatePicker.Label>Date of birth</DatePicker.Label>
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
              <DatePicker.ViewControl>
                <DatePicker.PrevTrigger />
                <HStack>
                  <DatePicker.MonthSelect />
                  <DatePicker.YearSelect />
                </HStack>
                <DatePicker.NextTrigger />
              </DatePicker.ViewControl>
              <DatePicker.DayTable />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  );
}
