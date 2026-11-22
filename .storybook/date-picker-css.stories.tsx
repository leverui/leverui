import { parseDate } from '@internationalized/date';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DatePicker } from '../src';

/** Expose responsive outside-day visibility on a stable March calendar. */
function ResponsiveOutsideDays(): JSX.Element {
  return (
    <>
      <DatePicker.Root
        inline
        hideOutsideDays={{ base: true, md: false }}
        defaultFocusedValue={parseDate('2026-03-14')}
      >
        <DatePicker.Content>
          <DatePicker.View view="day">
            <DatePicker.DayTable data-testid="date-picker-css-days" />
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Root>
    </>
  );
}

const meta = {
  title: 'Internal/DatePicker CSS Contract',
  component: ResponsiveOutsideDays,
} satisfies Meta<typeof ResponsiveOutsideDays>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ResponsiveOutside: Story = { render: ResponsiveOutsideDays };
