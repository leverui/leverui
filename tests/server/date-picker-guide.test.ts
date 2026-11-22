import { PersianCalendar, parseDate, type DateValue } from '@internationalized/date';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { DatePicker as DatePickerExport } from '../../src';

type ServerComponents = {
  DatePicker: typeof DatePickerExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Format a month consistently in the server-rendered range inputs. */
function formatMonth(date: DateValue): string {
  return `${String(date.month).padStart(2, '0')}/${date.year}`;
}

/** Render a selected month range from the package's published server entry. */
function renderMonthRange(): string {
  return renderToString(
    /** Keep recipe and machine contexts inside the same server render. */
    () =>
      createComponent(server.DatePicker.Root, {
        inline: true,
        selectionMode: 'range' as const,
        defaultView: 'month' as const,
        minView: 'month' as const,
        defaultValue: [parseDate('2026-03-01'), parseDate('2026-05-01')],
        format: formatMonth,
        /** Render both formatted inputs from the selected range. */
        get children() {
          return createComponent(server.DatePicker.Control, {
            /** Keep the two index-specific native inputs under one control. */
            get children() {
              return [
                createComponent(server.DatePicker.Input, { index: 0 }),
                createComponent(server.DatePicker.Input, { index: 1 }),
              ];
            },
          });
        },
      }),
  );
}

/** Construct the calendar requested by the Persian locale. */
function createPersianCalendar(identifier: string): PersianCalendar {
  if (identifier !== 'persian') throw new Error(`Unsupported calendar: ${identifier}`);
  return new PersianCalendar();
}

/** Render a Jalali calendar grid without a browser or portal. */
function renderJalaliCalendar(): string {
  return renderToString(
    /** Keep server style collection scoped to this calendar tree. */
    () =>
      createComponent(server.DatePicker.Root, {
        inline: true,
        locale: 'fa-IR',
        createCalendar: createPersianCalendar,
        defaultFocusedValue: parseDate('2026-03-14'),
        /** Render the machine's visible range and day grid. */
        get children() {
          return createComponent(server.DatePicker.Content, {
            /** Keep the visible grid inside the primitive's day view. */
            get children() {
              return createComponent(server.DatePicker.View, {
                view: 'day' as const,
                /** Include a localized range label and selectable cells. */
                get children() {
                  return [
                    createComponent(server.DatePicker.RangeText, {}),
                    createComponent(server.DatePicker.DayTable, {}),
                  ];
                },
              });
            },
          });
        },
      }),
  );
}

/** Confirm published SSR uses the same formatted period values as the browser. */
function verifiesMonthRange(): void {
  const markup = renderMonthRange();
  expect(markup).toContain('03/2026');
  expect(markup).toContain('05/2026');
  expect(markup).toContain('leverui-date-picker__input');
}

test('published DatePicker renders month range inputs on the server', verifiesMonthRange);

/** Confirm Jalali year and table parts survive server rendering. */
function verifiesJalaliCalendar(): void {
  const markup = renderJalaliCalendar();
  expect(markup).toMatch(/۱۴۰۴|1404/);
  expect(markup).toContain('leverui-date-picker__table');
  expect(markup).not.toContain('data-calendar="gregory"');
}

test('published DatePicker renders a Jalali day grid on the server', verifiesJalaliCalendar);
