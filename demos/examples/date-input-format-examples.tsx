import { DateFormatter, parseDate } from '@internationalized/date';
import { type JSX } from '@solidjs/web';
import { ArrowRightIcon } from '@lucide/solid';
import { DateInput, LocaleProvider } from '../../src';
import { DateInputParts } from './date-input-common';
import './date-input-examples.css';

const timeFormatter = new DateFormatter('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
});

/** Render hour and minute segments without a visible calendar date. */
export function DateInputTimeOnly(): JSX.Element {
  return (
    <DateInput.Root granularity="minute" formatter={timeFormatter} class="example-date-input">
      <DateInputParts label="Appointment time" />
    </DateInput.Root>
  );
}

/** Edit both dates of a trip with two indexed segment groups. */
export function DateInputRange(): JSX.Element {
  return (
    <DateInput.Root selectionMode="range" class="example-date-input">
      <DateInput.Label>Trip duration</DateInput.Label>
      <DateInput.Control class="example-date-input-range-control">
        <DateInput.Segments index={0} />
        <ArrowRightIcon class="example-date-input-range-icon" />
        <DateInput.Segments index={1} />
      </DateInput.Control>
      <DateInput.HiddenInput index={0} />
      <DateInput.HiddenInput index={1} />
    </DateInput.Root>
  );
}

/** Preserve leading zeros in the selected calendar date. */
export function DateInputLeadingZeros(): JSX.Element {
  return (
    <DateInput.Root
      shouldForceLeadingZeros
      defaultValue={[parseDate('2026-01-05')]}
      class="example-date-input"
    >
      <DateInputParts label="Date of birth" />
    </DateInput.Root>
  );
}

/** Inherit Arabic right-to-left formatting from the locale provider. */
export function DateInputRtl(): JSX.Element {
  return (
    <LocaleProvider locale="ar-AE">
      <DateInput.Root class="example-date-input">
        <DateInputParts label="تاريخ الميلاد" />
      </DateInput.Root>
    </LocaleProvider>
  );
}

/** Use German date ordering and a translated field label. */
export function DateInputLocale(): JSX.Element {
  return (
    <DateInput.Root locale="de-DE" class="example-date-input">
      <DateInputParts label="Geburtsdatum" />
    </DateInput.Root>
  );
}
