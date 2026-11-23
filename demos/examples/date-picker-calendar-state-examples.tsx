import { parseDate } from '@internationalized/date';
import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Badge, DatePicker, Flex, Stack, Text } from '../../src';
import { CalendarContent, CalendarExample } from './date-picker-calendar-common';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

/** Compare the five inline calendar sizes. */
export function DatePickerCalendarSizes(): JSX.Element {
  return (
    <Stack gap="8" direction="row" style={{ 'flex-wrap': 'wrap' }}>
      <For each={sizes}>
        {
          /** Keep a visible size badge above each separate calendar machine. */
          (size) => (
            <Stack gap="2" align="flex-start">
              <Badge variant="outline" style={{ width: 'fit-content' }}>
                {size}
              </Badge>
              <CalendarExample rootProps={{ size }} />
            </Stack>
          )
        }
      </For>
    </Stack>
  );
}

/** Keep the selected date in a caller-owned Solid signal. */
export function DatePickerCalendarControlled(): JSX.Element {
  const [value, setValue] = createSignal<DatePicker.DateValue[]>([parseDate('2025-03-15')]);

  /** Apply a calendar selection to the external signal. */
  function updateValue(details: DatePicker.ValueChangeDetails): void {
    setValue(details.value);
  }

  return (
    <Stack gap="4">
      <Text
        textStyle="sm"
        style={{
          'font-weight': 'var(--lui-font-weights-medium)',
        }}
      >
        Selected: {value()[0]?.toString() || 'None'}
      </Text>
      <DatePicker.Root
        value={value()}
        onValueChange={updateValue}
        inline
        style={{ width: 'fit-content' }}
      >
        <CalendarContent />
      </DatePicker.Root>
    </Stack>
  );
}

/** Display adjacent months for one range selection. */
export function DatePickerCalendarMultipleMonths(): JSX.Element {
  return (
    <DatePicker.Root numOfMonths={2} selectionMode="range" inline style={{ width: 'fit-content' }}>
      <DatePicker.Content unstyled>
        <DatePicker.View view="day">
          <DatePicker.Header />
          <Flex style={{ gap: 'var(--lui-spacing-4)' }}>
            <DatePicker.DayTable />
            <DatePicker.DayTable offset={1} />
          </Flex>
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
    </DatePicker.Root>
  );
}
