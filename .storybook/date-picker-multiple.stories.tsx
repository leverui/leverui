import { parseDate } from '@internationalized/date';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DatePicker } from '../src';

/** Select several independent dates through one inline calendar machine. */
function MultipleDatePicker(): JSX.Element {
  return (
    <>
      <DatePicker.Root
        inline
        selectionMode="multiple"
        defaultFocusedValue={parseDate('2026-03-14')}
      >
        <DatePicker.Label>Available dates</DatePicker.Label>
        <DatePicker.Context>
          {
            /** Expose machine selection without changing date semantics. */
            (api) => <output data-testid="date-picker-multiple-value">{api().valueAsString}</output>
          }
        </DatePicker.Context>
        <DatePicker.Content>
          <DatePicker.View view="day">
            <DatePicker.Header />
            <DatePicker.DayTable data-testid="date-picker-multiple-days" />
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Root>
    </>
  );
}

const meta = {
  title: 'Components/DatePicker/Multiple',
  component: MultipleDatePicker,
} satisfies Meta<typeof MultipleDatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = { render: MultipleDatePicker };
