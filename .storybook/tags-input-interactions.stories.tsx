import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { TagsInput } from '../src';

/** Accept values of at least three characters. */
function validateTag(details: { inputValue: string }): boolean {
  return details.inputValue.length >= 3;
}

/** Normalize submitted tags before they enter the machine. */
function sanitizeTag(value: string): string {
  return value.trim().toLowerCase();
}

/** Exercise browser form reset against the machine's initial value. */
function ResetExample(): JSX.Element {
  return (
    <>
      <form data-testid="tags-reset-form">
        <TagsInput.Root name="frameworks" defaultValue={['Solid']}>
          <TagsInput.Label>Reset frameworks</TagsInput.Label>
          <TagsInput.Control>
            <TagsInput.Items />
            <TagsInput.Input placeholder="Add reset tag" />
          </TagsInput.Control>
          <TagsInput.HiddenInput />
        </TagsInput.Root>
        <button type="reset">Reset tags</button>
      </form>
    </>
  );
}

/** Exercise indexed duplicates and editable tag previews. */
function DuplicateExample(): JSX.Element {
  return (
    <>
      <TagsInput.Root allowDuplicates editable defaultValue={['Echo', 'Echo']}>
        <TagsInput.Label>Duplicate tags</TagsInput.Label>
        <TagsInput.Control>
          <TagsInput.Items />
          <TagsInput.Input placeholder="Add duplicate tag" />
        </TagsInput.Control>
      </TagsInput.Root>
    </>
  );
}

/** Exercise documented delimiter, validation, sanitization, limit, and blur. */
function OptionsExample(): JSX.Element {
  return (
    <>
      <TagsInput.Root
        max={2}
        validate={validateTag}
        sanitizeValue={sanitizeTag}
        delimiter=";"
        blurBehavior="add"
      >
        <TagsInput.Label>Limited tags</TagsInput.Label>
        <TagsInput.Control>
          <TagsInput.Items />
          <TagsInput.Input placeholder="Add limited tag" />
        </TagsInput.Control>
        <TagsInput.Context>
          {
            /** Expose reactive machine input and values for browser verification. */
            (api) => (
              <output data-testid="options-machine-state">
                {JSON.stringify({ inputValue: api().inputValue, value: api().value })}
              </output>
            )
          }
        </TagsInput.Context>
      </TagsInput.Root>
      <button type="button">Next field</button>
    </>
  );
}

/** Exercise paste handling using the guide's comma delimiter. */
function PasteExample(): JSX.Element {
  return (
    <>
      <TagsInput.Root addOnPaste delimiter=",">
        <TagsInput.Label>Paste tags</TagsInput.Label>
        <TagsInput.Control>
          <TagsInput.Items />
          <TagsInput.Input placeholder="Paste tags" />
        </TagsInput.Control>
      </TagsInput.Root>
    </>
  );
}

/** Show that inherited machine and appearance defaults update in place. */
function ProviderExample(): JSX.Element {
  const [editable, setEditable] = createSignal(false);

  /** Enable inline editing and select the larger CSS appearance without remounting. */
  function enableEditing(): void {
    setEditable(true);
  }

  return (
    <>
      <TagsInput.PropsProvider
        value={() => ({ editable: editable(), size: editable() ? 'lg' : 'sm' })}
      >
        <TagsInput.Root defaultValue={['Solid']} data-testid="tags-provider-root">
          <TagsInput.Label>Provider tags</TagsInput.Label>
          <TagsInput.Control data-testid="tags-provider-control">
            <TagsInput.Items />
            <TagsInput.Input placeholder="Provider input" />
          </TagsInput.Control>
        </TagsInput.Root>
      </TagsInput.PropsProvider>
      <button type="button" onClick={enableEditing}>
        Enable editing
      </button>
    </>
  );
}

const meta = {
  title: 'Components/Tags Input Interactions',
  component: ResetExample,
} satisfies Meta<typeof ResetExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Reset: Story = { render: ResetExample };
export const Duplicates: Story = { render: DuplicateExample };
export const Options: Story = { render: OptionsExample };
export const Paste: Story = { render: PasteExample };
export const Provider: Story = { render: ProviderExample };
