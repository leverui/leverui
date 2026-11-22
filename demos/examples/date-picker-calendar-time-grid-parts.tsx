import { Time } from '@internationalized/date';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Stack, type DatePicker } from '../../src';

/** Generate half-hour meeting options, skipping sample unavailable slots. */
export function generateTimeSlots(date: DatePicker.DateValue, timeZone: string): Time[] {
  const day = date.toDate(timeZone).getDay();
  const slots: Time[] = [];
  const end = day === 5 ? 14 : 17;
  for (let hour = 9; hour < end; hour += 1) {
    slots.push(new Time(hour, 0));
    if (hour < end - 1 || day !== 5) slots.push(new Time(hour, 30));
  }
  const seed = date.day + date.month;
  return slots.filter(
    /** Omit repeating sample conflicts. */
    (_, index) => (index + seed) % 5 !== 0,
  );
}

/** Display one meeting time in the 24-hour notation. */
function formatTime(time: Time): string {
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
}

/** Display the selected date's weekday for the time panel. */
export function formatWeekday(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/** Display the selected month and day for the time panel. */
export function formatMonthDay(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
}

interface TimeGridProps {
  slots: readonly Time[];
  selectedTime: Time | null;
  onTimeClick: (time: Time) => void;
}

/** Render the available meeting times as toggleable buttons. */
export function TimeGrid(props: TimeGridProps): JSX.Element {
  return (
    <Stack
      gap="2"
      style={{
        'padding-inline': 'var(--leverui-spacing-4)',
        'padding-bottom': 'var(--leverui-spacing-4)',
        flex: '1',
        'overflow-y': 'auto',
        'max-height': '380px',
      }}
    >
      <For each={props.slots}>
        {
          /** Keep each button reactive to the selected time. */
          (time) => (
            <Button
              variant={props.selectedTime?.compare(time) === 0 ? 'solid' : 'outline'}
              size="sm"
              style={{
                'border-radius': 'var(--leverui-radii-lg)',
                'font-weight': 'var(--leverui-font-weights-semibold)',
              }}
              onClick={
                /** Select or clear the clicked meeting time. */
                () => props.onTimeClick(time)
              }
            >
              {formatTime(time)}
            </Button>
          )
        }
      </For>
    </Stack>
  );
}
