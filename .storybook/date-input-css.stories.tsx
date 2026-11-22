import { parseDate } from '@internationalized/date';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { DateInput } from '../src';
import './date-input-css.stories.css';

/** Exercise responsive, reactive, native, and consumer-authored presentation. */
function DateInputCssContract(): JSX.Element {
  const [large, setLarge] = createSignal(false);

  /** Change finite appearance without replacing the primitive's date machine. */
  function toggleAppearance(): void {
    setLarge(!large());
  }

  return (
    <>
      <button type="button" onClick={toggleAppearance}>
        Toggle date appearance
      </button>
      <DateInput.Root
        class="consumer-date-input"
        size={{ base: large() ? 'md' : 'sm', md: 'lg' }}
        variant={{ base: large() ? 'flushed' : 'outline', md: 'subtle' }}
        defaultValue={[parseDate('2026-03-14')]}
        name="css-date"
        style={{ '--leverui-date-input-border-color': 'rgb(12, 34, 56)' }}
        data-testid="date-input-css-root"
      >
        <DateInput.Label>Date of birth</DateInput.Label>
        <DateInput.Control>
          <DateInput.Segments data-testid="date-input-css-group" />
        </DateInput.Control>
        <DateInput.HiddenInput data-testid="date-input-css-hidden" />
      </DateInput.Root>
      <DateInput.Root unstyled defaultValue={[parseDate('2026-03-14')]}>
        <DateInput.Label>Unstyled date</DateInput.Label>
        <DateInput.Control>
          <DateInput.Segments data-testid="date-input-unstyled-group" />
        </DateInput.Control>
      </DateInput.Root>
    </>
  );
}

const meta = {
  title: 'Components/DateInput/CSS',
  component: DateInputCssContract,
} satisfies Meta<typeof DateInputCssContract>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contract: Story = { render: DateInputCssContract };
