import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { RadioGroup } from '../src';

/** Display one labeled native radio option. */
function FrameworkChoice(props: { value: string; label: string; disabled?: boolean }): JSX.Element {
  return (
    <RadioGroup.Item
      class="consumer-radio-group-item"
      value={props.value}
      disabled={props.disabled}
    >
      <RadioGroup.ItemHiddenInput />
      <RadioGroup.ItemIndicator class="consumer-radio-group-control" />
      <RadioGroup.ItemText class="consumer-radio-group-text">{props.label}</RadioGroup.ItemText>
    </RadioGroup.Item>
  );
}

/** Exercise selection, disabled state, and live CSS choices. */
function RadioGroupContractExample(): JSX.Element {
  const [value, setValue] = createSignal('react');
  const [solidVariant, setSolidVariant] = createSignal(false);

  /** Keep the selected value controlled by a Solid signal. */
  function handleValueChange(details: { value: string | null }): void {
    setValue(details.value ?? 'react');
  }

  /** Switch the CSS treatment without replacing the radio machine. */
  function toggleVariant(): void {
    setSolidVariant(!solidVariant());
  }

  return (
    <>
      <form style={{ width: '440px', padding: '24px' }} data-testid="radio-group-form">
        <RadioGroup.Root
          class="consumer-radio-group"
          name="framework"
          value={value()}
          onValueChange={handleValueChange}
          variant={solidVariant() ? 'solid' : 'outline'}
          data-testid="radio-group-root"
        >
          <RadioGroup.Label class="consumer-radio-group-label">Framework</RadioGroup.Label>
          <FrameworkChoice value="react" label="React" />
          <FrameworkChoice value="solid" label="Solid" />
          <FrameworkChoice value="vue" label="Vue" disabled />
        </RadioGroup.Root>
        <output data-testid="radio-group-selected">{value()}</output>
        <button type="button" onClick={toggleVariant} data-testid="toggle-radio-group-variant">
          Toggle variant
        </button>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Radio Group',
  component: RadioGroupContractExample,
} satisfies Meta<typeof RadioGroupContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
