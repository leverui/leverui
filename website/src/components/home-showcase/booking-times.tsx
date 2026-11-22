import { type Time } from '@internationalized/date';
import { Button } from '@leverui/components';
import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Show a time as "10:30", or nothing when no time is chosen. */
export function formatTime(time: Time | null): string {
  if (!time) return '';
  return `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
}

/** The open times on one day, as a grid of buttons; the chosen one is filled. */
export function BookingTimes(props: {
  day: string;
  timeZone: string;
  slots: readonly Time[];
  selected: Time | null;
  onSelect: (time: Time | null) => void;
}): JSX.Element {
  return (
    <div class="home-showcase-times">
      <div class="home-example-row home-showcase-between">
        <strong>{props.day}</strong>
        <span class="home-showcase-hint">{props.timeZone}</span>
      </div>
      <div class="home-showcase-time-grid" role="group" aria-label={`Open times on ${props.day}`}>
        <For each={props.slots}>
          {/** One open time; choosing it again clears it. */}
          {(time) => (
            <Button
              type="button"
              size="xs"
              colorPalette="cyan"
              variant={props.selected?.compare(time) === 0 ? 'solid' : 'outline'}
              aria-pressed={props.selected?.compare(time) === 0 ? 'true' : 'false'}
              onClick={
                /** Choose this time, or clear it when it is already chosen. */
                () => props.onSelect(props.selected?.compare(time) === 0 ? null : time)
              }
            >
              {formatTime(time)}
            </Button>
          )}
        </For>
      </div>
    </div>
  );
}
