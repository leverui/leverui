import { parseDate, parseZonedDateTime } from '@internationalized/date';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DateInput } from '../src';

/** Render locale-aware time segments with a changing timezone presentation. */
function ZonedDateInputStory(): JSX.Element {
  const [hideTimeZone, setHideTimeZone] = createSignal(false);

  /** Change only the visible timezone segment, preserving the date value. */
  function toggleTimeZone(): void {
    setHideTimeZone(
      /** Invert the current timezone presentation flag. */
      (hidden) => !hidden,
    );
  }

  return (
    <>
      <button type="button" onClick={toggleTimeZone}>
        Toggle time zone
      </button>
      <DateInput.Root
        defaultValue={[parseZonedDateTime('2026-03-14T08:45:00[America/Los_Angeles]')]}
        timeZone="America/Los_Angeles"
        granularity="minute"
        hideTimeZone={hideTimeZone()}
      >
        <DateInput.Label>Meeting time</DateInput.Label>
        <DateInput.Control>
          <DateInput.Segments data-testid="date-input-zoned-segments" />
        </DateInput.Control>
        <DateInput.HiddenInput data-testid="date-input-zoned-hidden" />
      </DateInput.Root>
    </>
  );
}

const meta = {
  title: 'Components/DateInput/Advanced',
  component: ZonedDateInputStory,
} satisfies Meta<typeof ZonedDateInputStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Zoned: Story = { render: ZonedDateInputStory };

/** Keep appearance defaults reactive for both owned and external date machines. */
function ProviderDateInputStory(): JSX.Element {
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');
  const machine = DateInput.useDateInput({ defaultValue: [parseDate('2026-03-20')] });

  /** Increase both root presentations without resetting either date. */
  function increaseSize(): void {
    setSize('lg');
  }

  /** Read the current appearance defaults for descendant roots. */
  function readDefaults(): { size: 'sm' | 'lg'; variant: 'outline' } {
    return { size: size(), variant: 'outline' };
  }

  return (
    <>
      <button type="button" onClick={increaseSize}>
        Increase date size
      </button>
      <DateInput.PropsProvider value={readDefaults}>
        <DateInput.Root defaultValue={[parseDate('2026-03-14')]}>
          <DateInput.Label>Owned date</DateInput.Label>
          <DateInput.Control>
            <DateInput.Segments data-testid="date-input-owned-segments" />
          </DateInput.Control>
        </DateInput.Root>
        <DateInput.RootProvider value={machine}>
          <DateInput.Label>Stored date</DateInput.Label>
          <DateInput.Control>
            <DateInput.Segments data-testid="date-input-provider-segments" />
          </DateInput.Control>
        </DateInput.RootProvider>
      </DateInput.PropsProvider>
    </>
  );
}

export const Provider: Story = { render: ProviderDateInputStory };
