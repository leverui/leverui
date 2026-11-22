import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { RatingGroup } from '../src';

/** Exercise pointer, keyboard, form, and live authored CSS behavior. */
function RatingGroupContractExample(): JSX.Element {
  const [value, setValue] = createSignal(2);
  const [large, setLarge] = createSignal(false);

  /** Keep the selected rating controlled by a Solid signal. */
  function handleValueChange(details: { value: number }): void {
    setValue(details.value);
  }

  /** Change the CSS size without replacing the primitive machine. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <form style={{ width: '440px', padding: '24px' }} data-testid="rating-group-form">
        <RatingGroup.Root
          name="score"
          value={value()}
          onValueChange={handleValueChange}
          size={large() ? 'lg' : 'sm'}
          data-testid="rating-group-root"
        >
          <RatingGroup.Label>Quality</RatingGroup.Label>
          <RatingGroup.Control />
          <RatingGroup.HiddenInput />
        </RatingGroup.Root>
        <output data-testid="rating-group-selected">{value()}</output>
        <button type="button" onClick={toggleSize} data-testid="toggle-rating-group-size">
          Toggle size
        </button>
      </form>
    </>
  );
}

/** Show the half-rating clip and machine selection markers. */
function RatingGroupHalfExample(): JSX.Element {
  return (
    <>
      <RatingGroup.Root name="score" defaultValue={2.5} allowHalf>
        <RatingGroup.Label>Quality</RatingGroup.Label>
        <RatingGroup.Control />
        <RatingGroup.HiddenInput />
      </RatingGroup.Root>
    </>
  );
}

/** Show the machine's disabled state on the visual items. */
function RatingGroupDisabledExample(): JSX.Element {
  return (
    <>
      <RatingGroup.Root name="score" defaultValue={2} disabled>
        <RatingGroup.Label>Quality</RatingGroup.Label>
        <RatingGroup.Control />
        <RatingGroup.HiddenInput />
      </RatingGroup.Root>
    </>
  );
}

const meta = {
  title: 'Components/Rating Group',
  component: RatingGroupContractExample,
} satisfies Meta<typeof RatingGroupContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
export const Half: Story = { render: RatingGroupHalfExample };
export const Disabled: Story = { render: RatingGroupDisabledExample };

/** Keep the primitive's rating behavior when default presentation is suppressed. */
function RatingGroupUnstyledExample(): JSX.Element {
  return (
    <RatingGroup.Root name="unstyled-score" defaultValue={2} unstyled data-testid="rating-unstyled">
      <RatingGroup.Label>Unstyled score</RatingGroup.Label>
      <RatingGroup.Control />
      <RatingGroup.HiddenInput />
    </RatingGroup.Root>
  );
}

export const Unstyled: Story = { render: RatingGroupUnstyledExample };
