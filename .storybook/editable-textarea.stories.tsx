import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Editable, type EditableValueChangeDetails } from '../src';

/** Exercise controlled multiline editing with the shared input appearance. */
function EditableTextareaExample(): JSX.Element {
  const [value, setValue] = createSignal('Notes');

  /** Keep the caller-owned value synchronized with the primitive's edit callback. */
  function changeValue(details: EditableValueChangeDetails): void {
    setValue(details.value);
  }

  return (
    <>
      <Editable.Root value={value()} onValueChange={changeValue} data-testid="multiline-root">
        <Editable.Label>Notes</Editable.Label>
        <Editable.Preview data-testid="multiline-preview" />
        <Editable.Textarea data-testid="multiline-input" />
        <Editable.Control>
          <Editable.EditTrigger data-testid="multiline-edit">Edit</Editable.EditTrigger>
          <Editable.CancelTrigger data-testid="multiline-cancel">Cancel</Editable.CancelTrigger>
          <Editable.SubmitTrigger data-testid="multiline-save">Save</Editable.SubmitTrigger>
        </Editable.Control>
      </Editable.Root>
    </>
  );
}

const meta = {
  title: 'Components/Editable Textarea',
  component: EditableTextareaExample,
} satisfies Meta<typeof EditableTextareaExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Controlled: Story = {};
