import assert from 'node:assert/strict';
import { parseDate } from '@internationalized/date';
import { DateInput, DateInputRoot } from '@leverui/components';
import { createComponent } from 'solid-js';
import { renderToString } from '@solidjs/web';

/** Render named and compound date controls through the installed Node entry. */
function renderPackedDateInput() {
  return renderToString(
    /** Establish the package's style context around both date machines. */
    () => [
      createComponent(DateInput.Root, {
        defaultValue: [parseDate('2026-03-14')],
        /** Render labeled segments and a native form input. */
        get children() {
          return [
            createComponent(DateInput.Label, { children: 'Packed date' }),
            createComponent(DateInput.Control, {
              /** Preserve the segmented editor's machine context. */
              get children() {
                return createComponent(DateInput.Segments, {});
              },
            }),
            createComponent(DateInput.HiddenInput, { name: 'packed-date' }),
          ];
        },
      }),
      createComponent(DateInputRoot, {
        defaultValue: [parseDate('2026-04-05')],
        /** Confirm the named root can mount a native input. */
        get children() {
          return createComponent(DateInput.HiddenInput, { name: 'named-date' });
        },
      }),
    ],
  );
}

const markup = renderPackedDateInput();
assert.match(markup, /lui-date-input__root/);
assert.match(markup, /lui-date-input__segmentGroup/);
assert.match(markup, /Packed date/);
assert.match(markup, /3\/14\/2026/);
