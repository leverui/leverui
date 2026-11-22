import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CalendarIcon } from '@lucide/solid';
import { DatePicker, Portal, Stack } from '../../src';

/** Show the standard labeled input and popup calendar. */
export function DatePickerBasic(): JSX.Element {
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

/** Present the five field sizes. */
export function DatePickerSizes(): JSX.Element {
  return (
    <Stack gap="4" style={{ 'max-width': '20rem' }}>
      <For each={['xs', 'sm', 'md', 'lg', 'xl'] as const}>
        {
          /** Render one independent picker for each size. */
          (size) => (
            <DatePicker.Root size={size}>
              <DatePicker.Label>{`Select date (${size})`}</DatePicker.Label>
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
          )
        }
      </For>
    </Stack>
  );
}

/** Present the outline, subtle, and flushed field variants. */
export function DatePickerVariants(): JSX.Element {
  return (
    <Stack gap="4" style={{ 'max-width': '20rem' }}>
      <For each={['outline', 'subtle', 'flushed'] as const}>
        {
          /** Render one independent picker for each variant. */
          (variant) => (
            <DatePicker.Root variant={variant}>
              <DatePicker.Label>{`Select date (${variant})`}</DatePicker.Label>
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
          )
        }
      </For>
    </Stack>
  );
}

/** Keep both the date input and calendar trigger disabled. */
export function DatePickerDisabled(): JSX.Element {
  return (
    <DatePicker.Root disabled style={{ 'max-width': '20rem' }}>
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
