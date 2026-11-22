import { getLocalTimeZone, isToday, isWeekend, type Time } from '@internationalized/date';
import { createMemo, createSignal, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { GlobeIcon } from '@lucide/solid';
import { Box, Center, DatePicker, Flex, HStack, Stack, Text } from '../../src';
import {
  formatMonthDay,
  formatWeekday,
  generateTimeSlots,
  TimeGrid,
} from './date-picker-calendar-time-grid-parts';
import './date-picker-calendar-time-grid.css';

const timeZone = getLocalTimeZone();

/** Pair an inline weekday calendar with context-dependent time slots. */
export function DatePickerCalendarTimeGrid(): JSX.Element {
  const [selectedDate, setSelectedDate] = createSignal<DatePicker.DateValue[]>([]);
  const [selectedTime, setSelectedTime] = createSignal<Time | null>(null);
  const date = createMemo(
    /** Read the first selected day for the meeting panel. */
    () => selectedDate()[0],
  );
  const slots = createMemo(
    /** Rebuild available slots only when the selected day changes. */
    () => {
      const selected = date();
      return selected ? generateTimeSlots(selected, timeZone) : [];
    },
  );

  /** Reset the time choice whenever a different calendar day is selected. */
  function updateDate(details: DatePicker.ValueChangeDetails): void {
    setSelectedDate(details.value);
    setSelectedTime(null);
  }

  /** Toggle one available meeting slot. */
  function updateTime(time: Time): void {
    setSelectedTime(
      /** Clear an active time when its button is clicked again. */
      (current) => (current?.compare(time) === 0 ? null : time),
    );
  }

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      style={{
        'border-width': '1px',
        'border-radius': 'var(--leverui-radii-xl)',
        overflow: 'hidden',
        width: 'fit-content',
      }}
    >
      <Box class="date-picker-calendar-time-divider">
        <Stack
          gap="0"
          style={{
            'padding-inline': 'var(--leverui-spacing-5)',
            'padding-block': 'var(--leverui-spacing-5)',
          }}
        >
          <Text
            textStyle="lg"
            style={{
              'font-weight': 'var(--leverui-font-weights-semibold)',
            }}
          >
            Select a date
          </Text>
          <Text
            textStyle="sm"
            style={{
              color: 'var(--leverui-colors-fg-muted)',
            }}
          >
            Pick a day for your meeting
          </Text>
        </Stack>
        <DatePicker.Root
          inline
          value={selectedDate()}
          onValueChange={updateDate}
          isDateUnavailable={
            /** Reserve weekends for the meeting schedule. */
            (value) => isWeekend(value, 'en-US')
          }
          style={{ width: 'fit-content' }}
        >
          <DatePicker.Content
            unstyled
            style={{
              'padding-inline': 'var(--leverui-spacing-3)',
              'padding-bottom': 'var(--leverui-spacing-4)',
            }}
          >
            <DatePicker.View view="day">
              <HStack justify="space-between" gap="0">
                <DatePicker.PrevTrigger />
                <DatePicker.RangeText
                  style={{
                    'font-weight': 'var(--leverui-font-weights-medium)',
                    'font-size': 'var(--leverui-font-sizes-sm)',
                  }}
                />
                <DatePicker.NextTrigger />
              </HStack>
              <DatePicker.DayTable />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Root>
        <HStack
          textStyle="xs"
          style={{
            'padding-inline': 'var(--leverui-spacing-5)',
            'padding-bottom': 'var(--leverui-spacing-4)',
            color: 'var(--leverui-colors-fg-muted)',
          }}
        >
          <GlobeIcon />
          <span>{timeZone}</span>
        </HStack>
      </Box>
      <Stack style={{ 'min-width': '240px', flex: '1' }}>
        <Show
          when={date()}
          fallback={
            <Center
              style={{
                height: '100%',
                padding: 'var(--leverui-spacing-10) var(--leverui-spacing-8)',
                color: 'var(--leverui-colors-fg-muted)',
              }}
            >
              <Stack align="center" gap="1" style={{ 'text-align': 'center' }}>
                <Text
                  textStyle="sm"
                  style={{
                    'font-weight': 'var(--leverui-font-weights-medium)',
                  }}
                >
                  Select a date
                </Text>
                <Text textStyle="xs">Available time slots will appear here</Text>
              </Stack>
            </Center>
          }
        >
          {
            /** Show contextual slots for the currently selected calendar day. */
            (activeDate) => (
              <Stack gap="0" style={{ flex: '1' }}>
                <Stack
                  gap="0"
                  style={{
                    'padding-inline': 'var(--leverui-spacing-5)',
                    'padding-top': 'var(--leverui-spacing-5)',
                    'padding-bottom': 'var(--leverui-spacing-3)',
                  }}
                >
                  <Text style={{ 'font-weight': 'var(--leverui-font-weights-semibold)' }}>
                    {isToday(activeDate(), timeZone)
                      ? 'Today'
                      : formatWeekday(activeDate().toDate(timeZone))}
                  </Text>
                  <Text
                    textStyle="sm"
                    style={{
                      color: 'var(--leverui-colors-fg-muted)',
                    }}
                  >
                    {formatMonthDay(activeDate().toDate(timeZone))}
                  </Text>
                </Stack>
                <TimeGrid slots={slots()} selectedTime={selectedTime()} onTimeClick={updateTime} />
              </Stack>
            )
          }
        </Show>
      </Stack>
    </Flex>
  );
}
