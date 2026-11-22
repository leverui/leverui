import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Editable } from '../src';

/** Exercise inline editing, controls, reactive state, and default styling. */
function EditableContractExample(): JSX.Element {
  const [disabled, setDisabled] = createSignal(false);
  const [size, setSize] = createSignal<'sm' | 'lg'>('sm');

  /** Toggle machine state and CSS size without replacing the native input. */
  function toggleState(): void {
    setDisabled(!disabled());
    setSize(size() === 'sm' ? 'lg' : 'sm');
  }

  return (
    <>
      <div data-testid="editable-contract">
        <Editable.Root
          defaultValue="Click to edit"
          disabled={disabled()}
          size={size()}
          data-testid="editable-root"
        >
          <Editable.Label>Name</Editable.Label>
          <Editable.Area>
            <Editable.Preview data-testid="editable-preview" />
            <Editable.Input data-testid="editable-input" />
          </Editable.Area>
          <Editable.Control>
            <Editable.EditTrigger data-testid="editable-edit">Edit</Editable.EditTrigger>
            <Editable.CancelTrigger data-testid="editable-cancel">Cancel</Editable.CancelTrigger>
            <Editable.SubmitTrigger data-testid="editable-submit">Save</Editable.SubmitTrigger>
          </Editable.Control>
        </Editable.Root>
        <button type="button" onClick={toggleState} data-testid="editable-toggle">
          Toggle Editable state
        </button>
      </div>
    </>
  );
}

/** Show the authored size selectors before and after the medium breakpoint. */
function EditableResponsiveExample(): JSX.Element {
  return (
    <>
      <Editable.Root size={{ base: 'sm', md: 'lg' }} data-testid="responsive-editable-root">
        <Editable.Preview data-testid="responsive-editable-preview" />
        <Editable.Input />
      </Editable.Root>
    </>
  );
}

const meta = {
  title: 'Components/Editable',
  component: EditableContractExample,
} satisfies Meta<typeof EditableContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
export const Responsive: Story = { render: EditableResponsiveExample };
