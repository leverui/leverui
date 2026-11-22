import { parseDate } from '@internationalized/date';
import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { afterEach, expect, it } from 'vitest';
import { DatePicker } from '../index';

afterEach(cleanup);

/** Exercise the public value renderer and its machine-owned remove action. */
async function verifiesRenderedValues(): Promise<void> {
  render(
    /** Mount the selected dates beneath the style and date contexts. */
    () => (
      <>
        <DatePicker.Root
          selectionMode="multiple"
          defaultValue={[parseDate('2026-03-14'), parseDate('2026-03-20')]}
        >
          <DatePicker.ValueText placeholder="Choose dates">
            {
              /** Give each selected value a control that removes just that date. */
              (item) => (
                <button type="button" onClick={item.remove}>
                  {item.valueAsString}
                </button>
              )
            }
          </DatePicker.ValueText>
        </DatePicker.Root>
      </>
    ),
  );

  const [firstValue, ...otherValues] = screen.getAllByRole('button');
  expect(otherValues).toHaveLength(1);
  if (!firstValue) throw new Error('Expected a removable date value.');
  fireEvent.click(firstValue);
  await waitFor(
    /** Confirm the machine removed only the selected value. */
    () => expect(screen.getAllByRole('button')).toHaveLength(1),
  );
  fireEvent.click(screen.getByRole('button'));
  await waitFor(
    /** Restore the placeholder after the last date is removed. */
    () => expect(screen.getByText('Choose dates')).toBeInTheDocument(),
  );
}

it('renders and removes selected dates through ValueText', verifiesRenderedValues);

/** Keep a consumer's explicit grid name ahead of the generated range name. */
function verifiesCustomGridName(): void {
  render(
    /** Mount the public day-grid composition under its date machine. */
    () => (
      <>
        <DatePicker.Root open defaultValue={[parseDate('2026-03-14')]}>
          <DatePicker.View view="day">
            <DatePicker.DayTable aria-label="Report dates" />
          </DatePicker.View>
        </DatePicker.Root>
      </>
    ),
  );
  expect(screen.getByRole('grid', { name: 'Report dates' })).toBeInTheDocument();
}

it('preserves an explicit Date Picker grid name', verifiesCustomGridName);

/** Honor a consumer's visible heading as the grid's accessible name. */
function verifiesGridLabelledBy(): void {
  render(
    /** Mount a custom table title under the public date machine. */
    () => (
      <>
        <DatePicker.Root open defaultValue={[parseDate('2026-03-14')]}>
          <DatePicker.View view="day">
            <span id="report-date-heading">Fiscal dates</span>
            <DatePicker.DayTable aria-labelledby="report-date-heading" />
          </DatePicker.View>
        </DatePicker.Root>
      </>
    ),
  );
  const grid = screen.getByRole('grid', { name: 'Fiscal dates' });
  expect(grid).toHaveAttribute('aria-labelledby', 'report-date-heading');
}

it('preserves a Date Picker grid heading reference', verifiesGridLabelledBy);
