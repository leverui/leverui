import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Field, Fieldset, Input } from '../src';

/** Exercise the Fieldset CSS appearance, native grouping, and nested Field state. */
function FieldsetContractExample(): JSX.Element {
  const [invalid, setInvalid] = createSignal(false);
  const [disabled, setDisabled] = createSignal(false);
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');

  /** Change all visible Fieldset states without remounting the control. */
  function toggleGroup(): void {
    setInvalid(!invalid());
    setDisabled(!disabled());
    setSize(size() === 'sm' ? 'lg' : 'sm');
  }

  return (
    <>
      <div data-testid="fieldset-contract">
        <Fieldset.Root
          id="profile-group"
          invalid={invalid()}
          disabled={disabled()}
          size={size()}
          data-testid="fieldset-root"
        >
          <Fieldset.Legend data-testid="fieldset-legend">Profile</Fieldset.Legend>
          <Fieldset.HelperText>Enter your name</Fieldset.HelperText>
          <Fieldset.Content data-testid="fieldset-content">
            <Field.Root id="profile-name" invalid={invalid()}>
              <Field.Label>Name</Field.Label>
              <Input data-testid="fieldset-input" />
            </Field.Root>
          </Fieldset.Content>
          <Fieldset.ErrorText>Check your profile</Fieldset.ErrorText>
        </Fieldset.Root>
        <button type="button" onClick={toggleGroup} data-testid="fieldset-toggle">
          Toggle Fieldset state
        </button>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Fieldset',
  component: FieldsetContractExample,
} satisfies Meta<typeof FieldsetContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
