import { parseDate } from '@internationalized/date';
import { type JSX } from '@solidjs/web';
import { CalendarIcon } from '@lucide/solid';
import { DatePicker, HStack } from '../../src';

/** Render every anatomy part in an always-open picker for the part Explorer. */
export function DatePickerExplorerDemo(): JSX.Element {
  return (
    <DatePicker.Root
      defaultValue={[parseDate('2025-03-15')]}
      open
      style={{ width: '100%', 'max-width': '320px' }}
    >
      <DatePicker.Label>Select date</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Input />
        <DatePicker.IndicatorGroup>
          <DatePicker.ClearTrigger />
          <DatePicker.Trigger>
            <CalendarIcon />
          </DatePicker.Trigger>
        </DatePicker.IndicatorGroup>
      </DatePicker.Control>
      <DatePicker.Positioner>
        <DatePicker.Content>
          <DatePicker.View view="day">
            <DatePicker.ViewControl>
              <DatePicker.PrevTrigger />
              <DatePicker.ViewTrigger>
                <DatePicker.RangeText />
              </DatePicker.ViewTrigger>
              <DatePicker.NextTrigger />
            </DatePicker.ViewControl>
            <HStack gap="2">
              <DatePicker.MonthSelect />
              <DatePicker.YearSelect />
            </HStack>
            <DatePicker.DayTable />
            <DatePicker.ValueText />
            <DatePicker.PresetTrigger value="last7Days">Last 7 days</DatePicker.PresetTrigger>
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Positioner>
    </DatePicker.Root>
  );
}
