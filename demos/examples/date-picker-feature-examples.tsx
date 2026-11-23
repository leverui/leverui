import { CalendarDateTime, DateFormatter, getLocalTimeZone } from '@internationalized/date';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CalendarIcon } from '@lucide/solid';
import { Button, DatePicker, Flex, Input, Portal } from '../../src';

/** Show two adjacent months in a popup calendar. */
export function DatePickerMultipleMonths(): JSX.Element {
  return (
    <DatePicker.Root numOfMonths={2} style={{ 'max-width': '24rem' }}>
      <DatePicker.Label>Select date</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Input />
        <DatePicker.IndicatorGroup>
          <DatePicker.Trigger>
            <CalendarIcon />
          </DatePicker.Trigger>
        </DatePicker.IndicatorGroup>
      </DatePicker.Control>
      <DatePicker.Positioner>
        <DatePicker.Content>
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
      </DatePicker.Positioner>
    </DatePicker.Root>
  );
}

/** Let the calendar machine select today's date directly. */
export function DatePickerTodayButton(): JSX.Element {
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
              <DatePicker.Header />
              <DatePicker.DayTable />
              <DatePicker.Context>
                {
                  /** Bind the footer action to the current machine instance. */
                  (picker) => (
                    <Button
                      variant="subtle"
                      size="sm"
                      onClick={
                        /** Select today in the picker's active time zone. */
                        () => picker().selectToday()
                      }
                    >
                      Today
                    </Button>
                  )
                }
              </DatePicker.Context>
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

const dateTimeFormatter = new DateFormatter('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
});
const localTimeZone = getLocalTimeZone();

/** Edit a calendar date and native time input without closing on selection. */
export function DatePickerWithTime(): JSX.Element {
  const [value, setValue] = createSignal<CalendarDateTime[]>([
    new CalendarDateTime(2025, 1, 29, 14, 30),
  ]);

  /** Apply a time edit while preserving the current calendar date. */
  function updateTime(event: Event & { currentTarget: HTMLInputElement }): void {
    const [hours, minutes] = event.currentTarget.value.split(':').map(Number);
    if (hours === undefined || minutes === undefined) return;
    if (!Number.isInteger(hours) || !Number.isInteger(minutes)) return;
    setValue(
      /** Rebuild the selected date with the edited hour and minute. */
      (previous) => [
        (previous[0] ?? new CalendarDateTime(2025, 1, 1, 0, 0)).set({
          hour: hours,
          minute: minutes,
        }),
      ],
    );
  }

  /** Preserve time while replacing the date selected in the calendar. */
  function updateDate(details: DatePicker.ValueChangeDetails): void {
    const nextDate = details.value[0];
    if (!nextDate) {
      setValue([]);
      return;
    }
    const previousTime = value()[0];
    setValue([
      new CalendarDateTime(
        nextDate.year,
        nextDate.month,
        nextDate.day,
        previousTime?.hour ?? 0,
        previousTime?.minute ?? 0,
      ),
    ]);
  }

  /** Show the selected date and time on the opening button. */
  function formattedDateTime(): string {
    const selected = value()[0];
    return selected
      ? dateTimeFormatter.format(selected.toDate(localTimeZone))
      : 'Select date and time';
  }

  /** Keep the native time field synchronized with the selected date value. */
  function timeValue(): string {
    const selected = value()[0];
    return selected
      ? `${String(selected.hour).padStart(2, '0')}:${String(selected.minute).padStart(2, '0')}`
      : '';
  }

  /** Render the machine trigger as a full-width date and time button. */
  const renderTrigger: NonNullable<DatePicker.TriggerProps['asChild']> = (getProps) => (
    <Button
      {...getProps()}
      variant="outline"
      style={{ width: '100%', 'justify-content': 'space-between' }}
    >
      {formattedDateTime()}
      <CalendarIcon />
    </Button>
  );

  return (
    <DatePicker.Root
      value={value()}
      onValueChange={updateDate}
      closeOnSelect={false}
      style={{ 'max-width': '20rem' }}
    >
      <DatePicker.Label>Date and time</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Trigger asChild={renderTrigger} unstyled />
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content>
            <DatePicker.View view="day">
              <DatePicker.Header />
              <DatePicker.DayTable />
              <Input type="time" value={timeValue()} onChange={updateTime} />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  );
}
