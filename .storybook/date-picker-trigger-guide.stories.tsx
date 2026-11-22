import { parseDate } from '@internationalized/date';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Button, DatePicker, IconButton } from '../src';

/** Render machine-owned trigger attributes on a styled Lever UI button. */
const renderButtonTrigger: NonNullable<DatePicker.TriggerProps['asChild']> = (getProps) => (
  <Button {...getProps()} variant="outline" data-testid="date-picker-button-trigger">
    <DatePicker.ValueText placeholder="Select date" />
  </Button>
);

/** Render a separate icon button without nesting native buttons. */
const renderIconTrigger: NonNullable<DatePicker.TriggerProps['asChild']> = (getProps) => (
  <IconButton
    {...getProps()}
    variant="outline"
    aria-label="Open outside-icon calendar"
    data-testid="date-picker-outside-trigger"
  >
    📅
  </IconButton>
);

/** Mark the actual native button received through the primitive's child renderer. */
function captureTrigger(element: Element): void {
  element.setAttribute('data-trigger-ref', element.tagName);
}

/** Share the same popup calendar across both trigger compositions. */
function CalendarPopup(): JSX.Element {
  return (
    <DatePicker.Positioner>
      <DatePicker.Content data-testid="date-picker-trigger-content">
        <DatePicker.View view="day">
          <DatePicker.Header />
          <DatePicker.DayTable data-testid="date-picker-trigger-days" />
        </DatePicker.View>
      </DatePicker.Content>
    </DatePicker.Positioner>
  );
}

/** Replace the trigger's native button with a Lever UI Button. */
function ButtonTriggerPicker(): JSX.Element {
  return (
    <>
      <DatePicker.Root defaultFocusedValue={parseDate('2026-03-14')}>
        <DatePicker.Label>Button date</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Trigger asChild={renderButtonTrigger} ref={captureTrigger} unstyled />
        </DatePicker.Control>
        <CalendarPopup />
      </DatePicker.Root>
    </>
  );
}

const meta = {
  title: 'Components/DatePicker/Trigger Guide',
  component: ButtonTriggerPicker,
} satisfies Meta<typeof ButtonTriggerPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ButtonTrigger: Story = { render: ButtonTriggerPicker };

/** Put an icon button outside the input within the same date control. */
function OutsideIconPicker(): JSX.Element {
  return (
    <>
      <DatePicker.Root defaultFocusedValue={parseDate('2026-03-14')}>
        <DatePicker.Label>Outside icon date</DatePicker.Label>
        <DatePicker.Control>
          <DatePicker.Input data-testid="date-picker-outside-input" />
          <DatePicker.Trigger asChild={renderIconTrigger} ref={captureTrigger} unstyled />
        </DatePicker.Control>
        <CalendarPopup />
      </DatePicker.Root>
    </>
  );
}

export const OutsideIcon: Story = { render: OutsideIconPicker };
