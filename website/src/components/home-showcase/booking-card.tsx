import { getLocalTimeZone, isWeekend, today, type Time } from '@internationalized/date';
import { Alert, Button, Card, ClientOnly, DatePicker, Skeleton } from '@leverui/components';
import { createMemo, createSignal, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  formatMonthDay,
  formatWeekday,
  generateTimeSlots,
} from '../../../../demos/examples/date-picker-calendar-time-grid-parts';
import { BookingTimes, formatTime } from './booking-times';

/**
 * Pick a weekday, then one of its open times, then book it. The calendar opens on the
 * visitor's own month, so it renders in the browser: a page built ahead of time cannot know
 * which day the visitor is on.
 */
function BookingFlow(): JSX.Element {
  const timeZone = getLocalTimeZone();
  const [dates, setDates] = createSignal<DatePicker.DateValue[]>([]);
  const [time, setTime] = createSignal<Time | null>(null);
  const [booked, setBooked] = createSignal(false);
  const date = createMemo(
    /** The chosen day, if any. */
    () => dates()[0],
  );
  const slots = createMemo(
    /** The open times on the chosen day. */
    () => {
      const chosen = date();
      return chosen ? generateTimeSlots(chosen, timeZone) : [];
    },
  );
  /** The chosen day as words, such as "Monday, March 22". */
  const dayLabel = () => {
    const chosen = date();
    if (!chosen) return '';
    const value = chosen.toDate(timeZone);
    return `${formatWeekday(value)}, ${formatMonthDay(value)}`;
  };

  /** A new day starts with no time chosen. */
  function chooseDate(details: DatePicker.ValueChangeDetails): void {
    setDates(details.value);
    setTime(null);
  }

  /** Start over with nothing chosen. */
  function reset(): void {
    setDates([]);
    setTime(null);
    setBooked(false);
  }

  return (
    <div class="home-showcase-booking">
      {/* The form stays in place, hidden, so the card keeps its height after booking. */}
      <div class={booked() ? 'home-example-stack home-showcase-hidden' : 'home-example-stack'}>
        <DatePicker.Root
          inline
          size="sm"
          colorPalette="cyan"
          value={dates()}
          onValueChange={chooseDate}
          min={today(timeZone)}
          isDateUnavailable={
            /** Calls happen on weekdays. */
            (value) => isWeekend(value, 'en-US')
          }
        >
          <DatePicker.Content unstyled>
            <DatePicker.View view="day">
              <div class="home-example-row home-showcase-between">
                <DatePicker.PrevTrigger />
                <DatePicker.RangeText class="home-showcase-month" />
                <DatePicker.NextTrigger />
              </div>
              <DatePicker.DayTable />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Root>
        <Show
          when={date()}
          fallback={<p class="home-showcase-hint">Pick a day to see open times.</p>}
        >
          <BookingTimes
            day={dayLabel()}
            timeZone={timeZone}
            slots={slots()}
            selected={time()}
            onSelect={setTime}
          />
          <Button
            type="button"
            colorPalette="cyan"
            size="sm"
            disabled={!time()}
            onClick={
              /** Book the chosen time. */
              () => setBooked(true)
            }
          >
            {time() ? `Book ${formatTime(time())}` : 'Pick a time'}
          </Button>
        </Show>
      </div>
      <Show when={booked()}>
        <div class="home-example-stack home-showcase-booked">
          <Alert.Root status="success" size="sm">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>You're booked</Alert.Title>
              <Alert.Description>
                {dayLabel()} at {formatTime(time())}. We sent you an invite.
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
          <Button type="button" variant="outline" size="sm" onClick={reset}>
            Book another call
          </Button>
        </div>
      </Show>
    </div>
  );
}

/** A call booking: a calendar of weekdays, the open times on the chosen day, and a confirmation. */
export function BookingCard(): JSX.Element {
  return (
    <Card.Root size="sm">
      <Card.Header>
        <Card.Title>Book a call</Card.Title>
        <Card.Description>Pick a day, then a time.</Card.Description>
      </Card.Header>
      <Card.Body>
        <ClientOnly fallback={<Skeleton class="home-showcase-calendar-placeholder" />}>
          {() => <BookingFlow />}
        </ClientOnly>
      </Card.Body>
    </Card.Root>
  );
}
