import { DateFormatter, parseDate, parseDateTime } from '@internationalized/date';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DateInput, LocaleProvider } from '../src';

/** Constrain an initial date to the supported calendar year. */
function ConstraintsStory(): JSX.Element {
  return (
    <>
      <DateInput.Root
        name="appointment"
        min={parseDate('2026-01-01')}
        max={parseDate('2026-12-31')}
        defaultValue={[parseDate('2025-03-14')]}
      >
        <DateInput.Label>Appointment in 2026</DateInput.Label>
        <DateInput.Control>
          <DateInput.Segments data-testid="date-input-constraints-segments" />
        </DateInput.Control>
        <DateInput.HiddenInput data-testid="date-input-constraints-hidden" />
      </DateInput.Root>
      <DateInput.Root
        name="last-appointment"
        min={parseDate('2026-01-01')}
        max={parseDate('2026-12-31')}
        defaultValue={[parseDate('2027-11-30')]}
      >
        <DateInput.Label>Latest appointment</DateInput.Label>
        <DateInput.Control>
          <DateInput.Segments data-testid="date-input-maximum-segments" />
        </DateInput.Control>
        <DateInput.HiddenInput data-testid="date-input-maximum-hidden" />
      </DateInput.Root>
    </>
  );
}

const meta = {
  title: 'Components/DateInput/Guide',
  component: ConstraintsStory,
} satisfies Meta<typeof ConstraintsStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Constraints: Story = { render: ConstraintsStory };

/** Render German date ordering through the machine locale prop. */
function LocaleStory(): JSX.Element {
  return (
    <>
      <DateInput.Root locale="de-DE" defaultValue={[parseDate('2026-03-14')]}>
        <DateInput.Label>Geburtsdatum</DateInput.Label>
        <DateInput.Control>
          <DateInput.Segments data-testid="date-input-locale-segments" />
        </DateInput.Control>
        <DateInput.HiddenInput data-testid="date-input-locale-hidden" />
      </DateInput.Root>
    </>
  );
}

export const Locale: Story = { render: LocaleStory };

/** Display a minute-granularity value without calendar segments. */
function TimeOnlyStory(): JSX.Element {
  const formatter = new DateFormatter('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
  return (
    <>
      <DateInput.Root
        formatter={formatter}
        granularity="minute"
        defaultValue={[parseDateTime('2026-03-14T08:45')]}
      >
        <DateInput.Label>Appointment time</DateInput.Label>
        <DateInput.Control>
          <DateInput.Segments data-testid="date-input-time-segments" />
        </DateInput.Control>
        <DateInput.HiddenInput data-testid="date-input-time-hidden" />
      </DateInput.Root>
    </>
  );
}

export const TimeOnly: Story = { render: TimeOnlyStory };

/** Force zero-padded date segments while retaining the date value. */
function LeadingZerosStory(): JSX.Element {
  return (
    <>
      <DateInput.Root shouldForceLeadingZeros defaultValue={[parseDate('2026-01-05')]}>
        <DateInput.Label>Zero-padded date</DateInput.Label>
        <DateInput.Control>
          <DateInput.Segments data-testid="date-input-zeros-segments" />
        </DateInput.Control>
        <DateInput.HiddenInput data-testid="date-input-zeros-hidden" />
      </DateInput.Root>
    </>
  );
}

export const LeadingZeros: Story = { render: LeadingZerosStory };

/** Inherit a right-to-left locale from the public LocaleProvider. */
function RtlStory(): JSX.Element {
  return (
    <>
      <LocaleProvider locale="ar-AE">
        <DateInput.Root defaultValue={[parseDate('2026-03-14')]}>
          <DateInput.Label>تاريخ الميلاد</DateInput.Label>
          <DateInput.Control>
            <DateInput.Segments data-testid="date-input-rtl-segments" />
          </DateInput.Control>
          <DateInput.HiddenInput data-testid="date-input-rtl-hidden" />
        </DateInput.Root>
      </LocaleProvider>
    </>
  );
}

export const Rtl: Story = { render: RtlStory };
