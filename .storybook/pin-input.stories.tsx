import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { PinInput, type PinInputValueChangeDetails } from '../src';

/** Exercise entry, focus movement, completion, and reactive disabled state. */
function PinInputContractExample(): JSX.Element {
  const [disabled, setDisabled] = createSignal(false);
  const [completed, setCompleted] = createSignal('');

  /** Toggle the same machine's native disabled state. */
  function toggleDisabled(): void {
    setDisabled(!disabled());
  }

  /** Show the complete code after Zag validates every field. */
  function handleComplete(details: PinInputValueChangeDetails): void {
    setCompleted(details.valueAsString);
  }

  return (
    <>
      <form data-testid="pin-form">
        <PinInput.Root
          count={4}
          name="code"
          defaultValue={['', '', '', '']}
          disabled={disabled()}
          onValueComplete={handleComplete}
          data-testid="pin-root"
        >
          <PinInput.Label>Verification code</PinInput.Label>
          <PinInput.HiddenInput />
          <PinInput.Control data-testid="pin-control">
            <PinInput.Input index={0} data-testid="pin-0" />
            <PinInput.Input index={1} data-testid="pin-1" />
            <PinInput.Input index={2} data-testid="pin-2" />
            <PinInput.Input index={3} data-testid="pin-3" />
          </PinInput.Control>
        </PinInput.Root>
        <output data-testid="pin-completed">{completed()}</output>
      </form>
      <button type="button" onClick={toggleDisabled} data-testid="pin-toggle">
        Toggle Pin Input
      </button>
    </>
  );
}

const meta = {
  title: 'Components/Pin Input',
  component: PinInputContractExample,
} satisfies Meta<typeof PinInputContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
