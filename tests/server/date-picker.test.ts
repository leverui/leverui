import { parseDate } from '@internationalized/date';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { DatePicker as DatePickerExport } from '../../src';

type ServerComponents = {
  DatePicker: typeof DatePickerExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render a selected date through the published server entry. */
function renderServerDatePicker(): string {
  return renderToString(
    /** Construct the date machine in the server owner. */
    () =>
      createComponent(server.DatePicker.Root, {
        name: 'birthday',
        defaultValue: [parseDate('2026-03-14')],
        /** Render the labeled field and visible selection. */
        get children() {
          return [
            createComponent(server.DatePicker.Label, { children: 'Date of birth' }),
            createComponent(server.DatePicker.Control, {
              /** Group the machine input and styled selection text. */
              get children() {
                return [
                  createComponent(server.DatePicker.Input, {}),
                  createComponent(server.DatePicker.ValueText, {}),
                ];
              },
            }),
            createComponent(server.DatePicker.View, {
              view: 'day' as const,
              /** Include the calendar grid in the published server markup. */
              get children() {
                return createComponent(server.DatePicker.DayTable, {});
              },
            }),
          ];
        },
      }),
  );
}

/** Check server markup without depending on client-only portal behavior. */
function verifiesServerMarkup(): void {
  const markup = renderServerDatePicker();
  expect(markup).toContain('lui-date-picker__root');
  expect(markup).toContain('lui-date-picker__label');
  expect(markup).toContain('lui-date-picker__input');
  expect(markup).toContain('aria-label="March 2026"');
  expect(markup).toContain('2026');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|onValueChange)=/);
}

test('published DatePicker renders a selected field on the server', verifiesServerMarkup);
