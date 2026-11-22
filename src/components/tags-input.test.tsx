import { cleanup, fireEvent, render, screen, waitFor } from '@solidjs/testing-library';
import { afterEach, expect, it } from 'vitest';
import { createSignal, flush } from 'solid-js';
import { TagsInput } from '../index';

afterEach(cleanup);

/** Add a tag through the public machine context. */
function AddSolidJSButton() {
  const api = TagsInput.useTagsInputContext();

  /** Request a new value from the current primitive machine. */
  function addSolidJS(): void {
    api().addValue('SolidJS');
  }

  return (
    <button type="button" onClick={addSolidJS}>
      Add SolidJS
    </button>
  );
}

/** Mount the compound composition with native form controls. */
function DefaultTagsInput() {
  return (
    <>
      <form data-testid="tags-form">
        <TagsInput.Root name="frameworks" defaultValue={['Solid']}>
          <TagsInput.Label>Frameworks</TagsInput.Label>
          <TagsInput.Control>
            <TagsInput.Items />
            <TagsInput.Input placeholder="Add framework" />
          </TagsInput.Control>
          <TagsInput.ClearTrigger>Clear all</TagsInput.ClearTrigger>
          <TagsInput.HiddenInput />
          <AddSolidJSButton />
        </TagsInput.Root>
      </form>
    </>
  );
}

/** Verify tag creation, deletion, clear, and native form submission. */
async function verifiesTagEditing(): Promise<void> {
  render(
    /** Create the machine inside the provider's style context. */
    () => <DefaultTagsInput />,
  );
  const input = screen.getByPlaceholderText('Add framework');
  expect(screen.getByText('Solid')).toHaveClass('leverui-tags-input__itemText');
  expect(input.closest('[data-tags-input-root]')).toHaveClass('leverui-tags-input__root');

  fireEvent.click(screen.getByRole('button', { name: 'Add SolidJS' }));
  await waitFor(
    /** Wait for Zag to add the entered value. */
    () => expect(screen.getByText('SolidJS')).toBeInTheDocument(),
  );
  const form = screen.getByTestId('tags-form') as HTMLFormElement;
  expect(form.querySelector('.leverui-tags-input__hiddenInput')).toBeInTheDocument();
  expect(new FormData(form).get('frameworks')).toContain('SolidJS');

  fireEvent.click(screen.getByRole('button', { name: 'Delete tag SolidJS' }));
  await waitFor(
    /** Wait for the item context to remove only its own value. */
    () => expect(screen.queryByText('SolidJS')).not.toBeInTheDocument(),
  );
  expect(screen.getByText('Solid')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Clear all tags' }));
  await waitFor(
    /** Wait for all native form values to clear. */
    () => expect(new FormData(form).get('frameworks')).toBe(''),
  );
}

it('adds, deletes, and clears tags through the primitive and the native form', verifiesTagEditing);

/** Expose controlled machine state and disabled field semantics. */
function ControlledTagsInput() {
  const [value, setValue] = createSignal(['one']);

  /** Apply each value change to the owning Solid signal. */
  function handleValueChange(details: { value: string[] }): void {
    setValue(details.value);
    flush();
  }

  return (
    <>
      <TagsInput.Root value={value()} onValueChange={handleValueChange} disabled invalid>
        <TagsInput.Label>Disabled tags</TagsInput.Label>
        <TagsInput.Control>
          <TagsInput.Items />
          <TagsInput.Input placeholder="Disabled field" />
        </TagsInput.Control>
        <TagsInput.HiddenInput />
      </TagsInput.Root>
    </>
  );
}

/** Preserve disabled, required, and invalid states on the machine input. */
function verifiesDisabledField(): void {
  render(
    /** Establish the controlled machine within its provider. */
    () => <ControlledTagsInput />,
  );
  const input = screen.getByPlaceholderText('Disabled field');
  expect(input).toBeDisabled();
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByText('one')).toBeInTheDocument();
}

it('preserves machine state and disabled field attributes', verifiesDisabledField);

/** Supply editable behavior through inherited root defaults. */
function EditableTagsInput() {
  return (
    <>
      <TagsInput.PropsProvider value={{ editable: true }}>
        <TagsInput.Root defaultValue={['Solid']}>
          <TagsInput.Control>
            <TagsInput.Items />
            <TagsInput.Input placeholder="Add tag" />
          </TagsInput.Control>
        </TagsInput.Root>
      </TagsInput.PropsProvider>
    </>
  );
}

/** Allow provider defaults to override the noneditable default. */
async function verifiesEditableDefaults(): Promise<void> {
  render(
    /** Create the provider before its descendant machine. */
    () => <EditableTagsInput />,
  );
  const editor = document.querySelector('.leverui-tags-input__itemInput');
  expect(editor).toHaveAttribute('hidden');
  fireEvent.dblClick(screen.getByText('Solid'));
  await waitFor(
    /** Wait for Zag to enter inline edit mode. */
    () => expect(editor).not.toHaveAttribute('hidden'),
  );
}

it('inherits editable behavior from PropsProvider', verifiesEditableDefaults);
