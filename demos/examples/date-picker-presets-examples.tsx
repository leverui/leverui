import {
  DateFormatter,
  getLocalTimeZone,
  isSameDay,
  isToday,
  today,
} from '@internationalized/date';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CalendarIcon } from '@lucide/solid';
import { Button, DatePicker, Flex, HStack, Portal, Spacer, Span, Stack, VStack } from '../../src';
import './date-picker-presets-layout.css';

const rangePresets = [
  { label: 'Last 7 days', value: 'last7Days' },
  { label: 'Last 30 days', value: 'last30Days' },
  { label: 'This month', value: 'thisMonth' },
  { label: 'Last month', value: 'lastMonth' },
  { label: 'This year', value: 'thisYear' },
  { label: 'Last year', value: 'lastYear' },
] as const;

/** Put six built-in date ranges beside the popup calendar. */
export function DatePickerPresets(): JSX.Element {
  return (
    <DatePicker.Root selectionMode="range" style={{ 'max-width': '32rem' }}>
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
          <DatePicker.Content
            style={{ 'max-width': '100dvw', width: 'fit-content', overflow: 'auto' }}
          >
            <Flex class="date-picker-presets-layout">
              <VStack
                align="stretch"
                gap={{ base: '1.5', sm: '2' }}
                class="date-picker-presets-shortcuts"
                style={{ height: '100%' }}
              >
                <For each={rangePresets}>
                  {
                    /** Bind each visible button to its built-in date range. */
                    (preset) => (
                      <DatePicker.PresetTrigger
                        value={preset.value}
                        asChild={
                          /** Pass the machine's button attributes to the surface button. */
                          (getProps) => (
                            <Button
                              {...getProps()}
                              variant="surface"
                              size="sm"
                              style={{ width: '100%' }}
                            >
                              {preset.label}
                            </Button>
                          )
                        }
                      />
                    )
                  }
                </For>
              </VStack>
              <Flex direction="column" style={{ flex: '1', 'min-width': '0' }}>
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
              </Flex>
            </Flex>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  );
}

const timeZone = getLocalTimeZone();
const currentDay = today(timeZone);
const tomorrow = currentDay.add({ days: 1 });
const sidebarPresets = [
  { label: 'Today', value: currentDay },
  { label: 'Tomorrow', value: tomorrow },
  { label: 'Next week', value: currentDay.add({ weeks: 1 }) },
  { label: '2 weeks', value: currentDay.add({ weeks: 2 }) },
  { label: '4 weeks', value: currentDay.add({ weeks: 4 }) },
];
const weekdayFormatter = new DateFormatter('en-US', { weekday: 'short' });
const shortDateFormatter = new DateFormatter('en-US', { day: 'numeric', month: 'short' });

/** Format nearby presets as weekdays and later ones as short dates. */
function formatSidebarDate(date: DatePicker.DateValue): string {
  const display = date.toDate(timeZone);
  return isToday(date, timeZone) || isSameDay(date, tomorrow)
    ? weekdayFormatter.format(display)
    : shortDateFormatter.format(display);
}

/** Show relative date shortcuts beside an always-visible calendar. */
export function DatePickerPresetsSidebar(): JSX.Element {
  return (
    <DatePicker.Root inline fixedWeeks style={{ width: 'fit-content', 'border-width': '1px' }}>
      <Flex direction={{ base: 'column', sm: 'row' }}>
        <Stack
          gap="0"
          class="date-picker-presets-sidebar"
          style={{ 'padding-block': 'var(--leverui-spacing-2)' }}
        >
          <For each={sidebarPresets}>
            {
              /** Keep shortcut styling tied to the current machine selection. */
              (preset) => (
                <DatePicker.Context>
                  {
                    /** Read the selected date when rendering this shortcut. */
                    (context) => (
                      <DatePicker.PresetTrigger
                        value={[preset.value]}
                        class="date-picker-preset-shortcut"
                        data-selected={
                          context().value[0]?.compare(preset.value) === 0 ? '' : undefined
                        }
                      >
                        <Span>{preset.label}</Span>
                        <Span
                          textStyle="sm"
                          style={{
                            color: 'var(--leverui-colors-fg-muted)',
                          }}
                        >
                          {formatSidebarDate(preset.value)}
                        </Span>
                      </DatePicker.PresetTrigger>
                    )
                  }
                </DatePicker.Context>
              )
            }
          </For>
        </Stack>
        <DatePicker.View view="day" style={{ padding: 'var(--leverui-spacing-3)' }}>
          <HStack justify="space-between" gap="0">
            <DatePicker.RangeText
              style={{
                'padding-inline-start': 'var(--leverui-spacing-4)',
                'font-weight': 'var(--leverui-font-weights-medium)',
              }}
            />
            <Spacer />
            <DatePicker.PrevTrigger />
            <DatePicker.NextTrigger />
          </HStack>
          <DatePicker.DayTable />
        </DatePicker.View>
      </Flex>
    </DatePicker.Root>
  );
}
