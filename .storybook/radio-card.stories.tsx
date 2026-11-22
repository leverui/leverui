import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { RadioCard } from '../src';

/** Display one fully labeled native radio card. */
function FrameworkCard(props: { value: string; label: string; disabled?: boolean }): JSX.Element {
  return (
    <RadioCard.Item value={props.value} disabled={props.disabled} class="consumer-radio-card-item">
      <RadioCard.ItemHiddenInput />
      <RadioCard.ItemControl class="consumer-radio-card-control">
        <RadioCard.ItemContent class="consumer-radio-card-content">
          <RadioCard.ItemText class="consumer-radio-card-text">{props.label}</RadioCard.ItemText>
          <RadioCard.ItemDescription class="consumer-radio-card-description">
            Choose {props.label} for this project.
          </RadioCard.ItemDescription>
        </RadioCard.ItemContent>
        <RadioCard.ItemIndicator class="consumer-radio-card-indicator" />
      </RadioCard.ItemControl>
      <RadioCard.ItemAddon class="consumer-radio-card-addon">
        Native radio selection
      </RadioCard.ItemAddon>
    </RadioCard.Item>
  );
}

/** Exercise selection, disabled state, and live CSS choices in a browser. */
function RadioCardContractExample(): JSX.Element {
  const [value, setValue] = createSignal('react');
  const [solidVariant, setSolidVariant] = createSignal(false);

  /** Keep the selected value controlled by a Solid signal. */
  function handleValueChange(details: { value: string | null }): void {
    setValue(details.value ?? 'react');
  }

  /** Switch a finite CSS treatment without replacing the radio machine. */
  function toggleVariant(): void {
    setSolidVariant(!solidVariant());
  }

  return (
    <>
      <form style={{ width: '440px', padding: '24px' }} data-testid="radio-card-form">
        <RadioCard.Root
          name="framework"
          value={value()}
          onValueChange={handleValueChange}
          variant={solidVariant() ? 'solid' : 'outline'}
          class="consumer-radio-card"
          data-testid="radio-card-root"
        >
          <RadioCard.Label class="consumer-radio-card-label">Framework</RadioCard.Label>
          <FrameworkCard value="react" label="React" />
          <FrameworkCard value="solid" label="Solid" />
          <FrameworkCard value="vue" label="Vue" disabled />
        </RadioCard.Root>
        <output data-testid="radio-card-selected">{value()}</output>
        <button type="button" onClick={toggleVariant} data-testid="toggle-radio-card-variant">
          Toggle variant
        </button>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Radio Card',
  component: RadioCardContractExample,
} satisfies Meta<typeof RadioCardContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
