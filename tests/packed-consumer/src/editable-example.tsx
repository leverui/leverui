import { Editable } from '@leverui/components';
import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';

/** Exercise installed inline editing and reactive native state. */
export function PackedEditable(): JSX.Element {
  const [disabled, setDisabled] = createSignal(false);

  /** Toggle the installed machine without remounting its input. */
  function toggleDisabled(): void {
    setDisabled(!disabled());
  }

  return (
    <section class="packed-editable" aria-label="Packed Editable example">
      <Editable.Root
        defaultValue="Packed name"
        disabled={disabled()}
        data-testid="packed-editable-root"
      >
        <Editable.Label>Name</Editable.Label>
        <Editable.Preview data-testid="packed-editable-preview" />
        <Editable.Input data-testid="packed-editable-input" />
        <Editable.Control>
          <Editable.EditTrigger data-testid="packed-editable-edit">Edit</Editable.EditTrigger>
          <Editable.CancelTrigger data-testid="packed-editable-cancel">
            Cancel
          </Editable.CancelTrigger>
          <Editable.SubmitTrigger data-testid="packed-editable-save">Save</Editable.SubmitTrigger>
        </Editable.Control>
      </Editable.Root>
      <button type="button" onClick={toggleDisabled} data-testid="packed-editable-toggle">
        Toggle editing
      </button>
    </section>
  );
}
