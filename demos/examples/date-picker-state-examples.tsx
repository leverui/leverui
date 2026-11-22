import { parseDate } from '@internationalized/date';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CalendarIcon } from '@lucide/solid';
import { DatePicker, Portal, Stack, Tag, Text, Wrap } from '../../src';

/** Keep the selected date in caller-owned Solid state. */
export function DatePickerControlled(): JSX.Element {
  const [value, setValue] = createSignal<DatePicker.DateValue[]>([parseDate('2026-01-26')]);

  /** Apply the selected dates to the external signal. */
  function updateValue(details: DatePicker.ValueChangeDetails): void {
    setValue(details.value);
  }

  return (
    <Stack gap="4" style={{ 'max-width': '20rem' }}>
      <Text textStyle="sm">
        Selected:{' '}
        {value()
          .map(
            /** Display each selected date in machine serialization order. */
            (date) => date.toString(),
          )
          .join(', ')}
      </Text>
      <DatePicker.Root value={value()} onValueChange={updateValue}>
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
    </Stack>
  );
}

/** Own the picker machine outside its rendered root. */
export function DatePickerStore(): JSX.Element {
  const picker = DatePicker.useDatePicker();
  return (
    <Stack gap="4" align="flex-start" style={{ 'max-width': '20rem' }}>
      <Text textStyle="sm">Selected: {picker().valueAsString.join(', ') || 'None'}</Text>
      <DatePicker.RootProvider value={picker}>
        <DatePicker.Label>Select range</DatePicker.Label>
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
      </DatePicker.RootProvider>
    </Stack>
  );
}

/** Format one selected date as a short weekday and month label. */
function formatWithDay(date: DatePicker.DateValue): string {
  return date.toDate('UTC').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

/** Show removable tags for every independently selected date. */
function MultipleDateValues(): JSX.Element {
  return (
    <DatePicker.ValueText placeholder="Select dates...">
      {
        /** Render each chosen calendar day as a removable tag. */
        ({ value, remove }) => (
          <Tag.Root size="lg" variant="subtle">
            <Tag.Label>{formatWithDay(value)}</Tag.Label>
            <Tag.EndElement>
              <Tag.CloseTrigger onClick={remove} />
            </Tag.EndElement>
          </Tag.Root>
        )
      }
    </DatePicker.ValueText>
  );
}

/** Put multiple chosen dates in a wrapped tag field. */
export function DatePickerMultipleSelection(): JSX.Element {
  return (
    <DatePicker.Root selectionMode="multiple" style={{ 'max-width': 'var(--leverui-sizes-sm)' }}>
      <DatePicker.Label>Meeting dates</DatePicker.Label>
      <DatePicker.Control>
        <Wrap
          gap="2"
          style={{
            'border-width': '1px',
            'min-height': 'var(--leverui-sizes-10)',
            'align-items': 'center',
            width: '100%',
            'border-radius': 'var(--leverui-radii-l2)',
            'font-size': 'var(--leverui-font-sizes-sm)',
            'padding-block': 'var(--leverui-spacing-1\\.5)',
            'padding-inline-start': 'var(--leverui-spacing-2\\.5)',
            'padding-inline-end': 'var(--leverui-spacing-8)',
          }}
        >
          <MultipleDateValues />
        </Wrap>
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
