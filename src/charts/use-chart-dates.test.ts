import { createRoot } from 'solid-js';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { useChart } from './use-chart';

const systemTimeZone = process.env.TZ;

/** Run each check eight hours behind UTC, where a UTC midnight is still the previous day. */
function useWesternTimeZone(): void {
  process.env.TZ = 'America/Los_Angeles';
}

/** Put the time zone back for the other test files. */
function restoreTimeZone(): void {
  if (systemTimeZone === undefined) delete process.env.TZ;
  else process.env.TZ = systemTimeZone;
}

beforeEach(useWesternTimeZone);
afterEach(restoreTimeZone);

/** Build a chart model and hand back its date formatter. */
function dateFormatter(options: Intl.DateTimeFormatOptions): (value: string) => string {
  return createRoot(
    /** Own the chart model for one assertion. */
    (dispose) => {
      const format = useChart({ data: [] }).formatDate(options);
      dispose();
      return format;
    },
  );
}

/** Show a calendar date as the day that was written, in any time zone. */
function keepsCalendarDay(): void {
  const format = dateFormatter({ month: 'short', day: '2-digit' });
  expect(format('2024-01-01')).toBe('Jan 01');
  expect(dateFormatter({ year: 'numeric', month: 'short' })('2024-01')).toBe('Jan 2024');
  expect(dateFormatter({ year: 'numeric' })('2024')).toBe('2024');
}

/** Show a date with a time in the reader's own time zone. */
function keepsLocalTimeForTimestamps(): void {
  const format = dateFormatter({ month: 'short', day: '2-digit', hour: '2-digit', hour12: false });
  expect(format('2024-01-01T02:00:00Z')).toBe('Dec 31, 18');
}

/** Let an explicit time zone win over the calendar-date rule. */
function honorsExplicitTimeZone(): void {
  const format = dateFormatter({ month: 'short', day: '2-digit', timeZone: 'Asia/Tokyo' });
  expect(format('2024-01-01')).toBe('Jan 01');
  const western = dateFormatter({ month: 'short', day: '2-digit', timeZone: 'America/Denver' });
  expect(western('2024-01-01')).toBe('Dec 31');
}

it('formats a calendar date as the day that was written', keepsCalendarDay);
it('formats a timestamp in the local time zone', keepsLocalTimeForTimestamps);
it('honors an explicit time zone', honorsExplicitTimeZone);
