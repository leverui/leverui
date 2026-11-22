import assert from 'node:assert/strict';
import { parseDate } from '@internationalized/date';
import { DatePicker, DatePickerRoot } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render named and compound calendar entries from the installed archive. */
function renderPackedDatePicker() {
  return renderToString(
    /** Render both machines through the published server entry. */
    () => [
      createComponent(DatePicker.Root, {
        defaultValue: [parseDate('2026-03-14')],
        inline: true,
        /** Render a selected field and the native range text. */
        get children() {
          return [
            createComponent(DatePicker.Label, { children: 'Packed calendar' }),
            createComponent(DatePicker.Control, {
              /** Keep the selected input beneath its root machine. */
              get children() {
                return createComponent(DatePicker.Input, {});
              },
            }),
            createComponent(DatePicker.View, {
              view: 'day',
              /** Check the native div of the named range-text part. */
              get children() {
                return createComponent(DatePicker.RangeText, {});
              },
            }),
          ];
        },
      }),
      createComponent(DatePickerRoot, {
        defaultValue: [parseDate('2026-04-05')],
        /** Confirm the named root renders a selected input. */
        get children() {
          return createComponent(DatePicker.Input, {});
        },
      }),
    ],
  );
}

const markup = renderPackedDatePicker();
assert.match(markup, /leverui-date-picker__root/);
assert.match(markup, /leverui-date-picker__input/);
assert.match(markup, /Packed calendar/);
assert.match(markup, /03\/14\/2026/);
assert.match(markup, /<div[^>]*data-date-picker-range-text/);
