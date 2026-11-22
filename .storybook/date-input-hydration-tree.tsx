import { parseDate } from '@internationalized/date';
import { createComponent } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { DateInput as DateInputExport } from '../src';

export type DateInputHydrationComponents = {
  DateInput: typeof DateInputExport;
};

/** Render identical date controls from published server and browser entries. */
export function renderDateInputHydrationTree({
  DateInput,
}: DateInputHydrationComponents): JSX.Element {
  return createComponent(DateInput.Root, {
    id: 'hydrated-date-input',
    name: 'hydrated-date',
    defaultValue: [parseDate('2026-03-14')],
    /** Keep every part inside the same date machine. */
    get children() {
      return [
        createComponent(DateInput.Label, { children: 'Hydrated date' }),
        createComponent(DateInput.Control, {
          /** Keep the segmented editor under the machine control. */
          get children() {
            return createComponent(DateInput.Segments, {});
          },
        }),
        createComponent(DateInput.HiddenInput, {}),
      ];
    },
  });
}
