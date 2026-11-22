import { parseDate } from '@internationalized/date';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { DateInput, Stack } from '../../src';
import { DateInputParts } from './date-input-common';
import './date-input-examples.css';

const sizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
const variants = ['outline', 'subtle', 'flushed'] as const;

/** Show the unselected birth-date editor. */
export function DateInputBasic(): JSX.Element {
  return (
    <DateInput.Root class="example-date-input">
      <DateInputParts label="Date of birth" />
    </DateInput.Root>
  );
}

/** Compare all seven date-input sizes. */
export function DateInputSizes(): JSX.Element {
  return (
    <Stack gap="4" class="example-date-input">
      <For each={sizes}>
        {
          /** Apply a supported size to the same segmented editor. */
          (size) => (
            <DateInput.Root size={size}>
              <DateInputParts label={`Date of birth (size: ${size})`} />
            </DateInput.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Compare the outline, subtle, and flushed authored treatments. */
export function DateInputVariants(): JSX.Element {
  return (
    <Stack gap="4" class="example-date-input">
      <For each={variants}>
        {
          /** Apply a supported variant to the same segmented editor. */
          (variant) => (
            <DateInput.Root variant={variant}>
              <DateInputParts label={`Date of birth (variant: ${variant})`} />
            </DateInput.Root>
          )
        }
      </For>
    </Stack>
  );
}

/** Keep every date segment disabled. */
export function DateInputDisabled(): JSX.Element {
  return (
    <DateInput.Root disabled class="example-date-input">
      <DateInputParts label="Date of birth" />
    </DateInput.Root>
  );
}

/** Display a supplied date without allowing edits. */
export function DateInputReadOnly(): JSX.Element {
  return (
    <DateInput.Root readOnly defaultValue={[parseDate('2026-01-26')]} class="example-date-input">
      <DateInputParts label="Date of birth" />
    </DateInput.Root>
  );
}

/** Mark the date editor invalid for form feedback. */
export function DateInputInvalid(): JSX.Element {
  return (
    <DateInput.Root invalid class="example-date-input">
      <DateInputParts label="Date of birth" />
    </DateInput.Root>
  );
}

/** Display a preselected calendar date. */
export function DateInputDefaultValue(): JSX.Element {
  return (
    <DateInput.Root defaultValue={[parseDate('2026-01-26')]} class="example-date-input">
      <DateInputParts label="Date of birth" />
    </DateInput.Root>
  );
}

/** Limit the appointment date to the 2026 calendar year. */
export function DateInputMinMax(): JSX.Element {
  return (
    <DateInput.Root
      min={parseDate('2026-01-01')}
      max={parseDate('2026-12-31')}
      class="example-date-input"
    >
      <DateInputParts label="Appointment date (2026 only)" />
    </DateInput.Root>
  );
}

/** Include hour and minute segments after the calendar date. */
export function DateInputGranularity(): JSX.Element {
  return (
    <DateInput.Root granularity="minute" class="example-date-input">
      <DateInputParts label="Appointment" />
    </DateInput.Root>
  );
}
