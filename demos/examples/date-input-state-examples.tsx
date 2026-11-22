import { parseDate, parseZonedDateTime } from '@internationalized/date';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { XIcon } from '@lucide/solid';
import { Checkbox, DateInput, HStack, IconButton, Stack, Text } from '../../src';
import { DateInputParts } from './date-input-common';
import './date-input-examples.css';

/** Keep the selected date in caller-owned Solid state. */
export function DateInputControlled(): JSX.Element {
  const [value, setValue] = createSignal<DateInput.DateValue[]>([parseDate('2026-01-26')]);

  /** Synchronize the selected calendar values with the external signal. */
  function updateValue(details: DateInput.ValueChangeDetails): void {
    setValue(details.value);
  }

  return (
    <Stack gap="4" align="flex-start" class="example-date-input">
      <Text textStyle="sm">
        Selected:{' '}
        {value()
          .map(
            /** Preserve each machine date's exact serialized value. */
            (date) => date.toString(),
          )
          .join(', ') || 'None'}
      </Text>
      <DateInput.Root value={value()} onValueChange={updateValue}>
        <DateInputParts label="Date of birth" />
      </DateInput.Root>
    </Stack>
  );
}

/** Clear the current date through the public date-input context. */
function ClearTrigger(): JSX.Element {
  const dateInput = DateInput.useDateInputContext();

  /** Remove every selected date from the segmented editor. */
  function clearDate(): void {
    dateInput().clearValue();
  }

  return (
    <>
      {dateInput().value.length > 0 && (
        <IconButton aria-label="Clear date" variant="ghost" size="xs" onClick={clearDate}>
          <XIcon />
        </IconButton>
      )}
    </>
  );
}

/** Place a clear button alongside the preselected date segments. */
export function DateInputWithClearTrigger(): JSX.Element {
  return (
    <DateInput.Root defaultValue={[parseDate('2026-01-26')]} class="example-date-input">
      <DateInput.Label>Date of birth</DateInput.Label>
      <DateInput.Control class="example-date-input-clear-control">
        <DateInput.Segments />
        <ClearTrigger />
      </DateInput.Control>
      <DateInput.HiddenInput />
    </DateInput.Root>
  );
}

/** Switch between 12-hour display and a hidden time-zone segment. */
export function DateInputTimeZone(): JSX.Element {
  const [hour12, setHour12] = createSignal(true);
  const [hideTimeZone, setHideTimeZone] = createSignal(false);

  /** Update the hour cycle from the first checkbox. */
  function updateHourCycle(details: Checkbox.CheckedChangeDetails): void {
    setHour12(Boolean(details.checked));
  }

  /** Update the time-zone presentation from the second checkbox. */
  function updateTimeZone(details: Checkbox.CheckedChangeDetails): void {
    setHideTimeZone(Boolean(details.checked));
  }

  return (
    <Stack gap="4" class="example-date-input">
      <DateInput.Root
        defaultValue={[parseZonedDateTime('2026-02-03T08:45:00[America/Los_Angeles]')]}
        timeZone="America/Los_Angeles"
        granularity="minute"
        hourCycle={hour12() ? 12 : 24}
        hideTimeZone={hideTimeZone()}
      >
        <DateInputParts label="Meeting time" />
      </DateInput.Root>
      <HStack gap="4">
        <Checkbox.Root size="sm" checked={hour12()} onCheckedChange={updateHourCycle}>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>12 hour</Checkbox.Label>
        </Checkbox.Root>
        <Checkbox.Root size="sm" checked={hideTimeZone()} onCheckedChange={updateTimeZone}>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Hide time zone</Checkbox.Label>
        </Checkbox.Root>
      </HStack>
    </Stack>
  );
}
