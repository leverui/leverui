import { parseDate } from '@internationalized/date';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';
import { expect, test } from 'vitest';
import type { DateInput as DateInputExport } from '../../src';

type ServerComponents = {
  DateInput: typeof DateInputExport;
};

const serverEntry = '../../dist/server/index.js';
const server = (await import(serverEntry)) as ServerComponents;

/** Render the public DateInput parts through the published server entry. */
function renderServerDateInput(): string {
  return renderToString(
    /** Construct a date machine without a presentation provider. */
    () =>
      createComponent(server.DateInput.Root, {
        name: 'birthday',
        defaultValue: [parseDate('2026-03-14')],
        /** Render the labeled segments and native form field. */
        get children() {
          return [
            createComponent(server.DateInput.Label, { children: 'Date of birth' }),
            createComponent(server.DateInput.Control, {
              /** Keep visible segments under the machine control. */
              get children() {
                return createComponent(server.DateInput.Segments, {});
              },
            }),
            createComponent(server.DateInput.HiddenInput, {}),
          ];
        },
      }),
  );
}

/** Check styled SSR markup and machine-generated form state. */
function verifiesServerMarkup(): void {
  const markup = renderServerDateInput();
  expect(markup).toContain('leverui-date-input__root');
  expect(markup).toContain('leverui-date-input__label');
  expect(markup).toContain('leverui-date-input__control');
  expect(markup).toContain('leverui-date-input__segmentGroup');
  expect(markup).toContain('leverui-date-input__segment');
  expect(markup).toContain('value="3/14/2026"');
  expect(markup).not.toMatch(/\s(?:recipe|unstyled|onValueChange)=/);
}

test(
  'published DateInput renders date segments and a form value on the server',
  verifiesServerMarkup,
);
