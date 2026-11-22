import { createSignal } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { TagsInput } from '../src';

/** Exercise controlled creation, deletion, clear, and native form values. */
function TagsInputContractExample(): JSX.Element {
  const [value, setValue] = createSignal(['Solid']);
  const [large, setLarge] = createSignal(false);

  /** Keep tag values in the owning Solid signal. */
  function handleValueChange(details: { value: string[] }): void {
    setValue(details.value);
  }

  /** Change CSS variants without replacing the machine root. */
  function toggleAppearance(): void {
    setLarge(!large());
  }

  return (
    <>
      <form data-testid="tags-input-form" style={{ padding: '24px' }}>
        <TagsInput.Root
          name="frameworks"
          value={value()}
          onValueChange={handleValueChange}
          size={large() ? 'lg' : 'sm'}
          variant={large() ? 'subtle' : 'outline'}
          data-testid="tags-input-root"
        >
          <TagsInput.Label>Frameworks</TagsInput.Label>
          <TagsInput.Control data-testid="tags-input-control">
            <TagsInput.Items />
            <TagsInput.Input placeholder="Add framework" />
            <TagsInput.ClearTrigger />
          </TagsInput.Control>
          <TagsInput.HiddenInput />
        </TagsInput.Root>
        <output data-testid="tags-input-value">{value().join(', ')}</output>
        <button type="button" onClick={toggleAppearance} data-testid="tags-input-appearance">
          Toggle appearance
        </button>
      </form>
    </>
  );
}

/** Show machine states and a caller-owned machine in one browser fixture. */
function TagsInputStatesExample(): JSX.Element {
  const machine = TagsInput.useTagsInput({ defaultValue: ['External'] });
  return (
    <>
      <div style={{ display: 'grid', gap: '16px', padding: '24px' }}>
        <TagsInput.Root disabled defaultValue={['Disabled']}>
          <TagsInput.Label>Disabled tags</TagsInput.Label>
          <TagsInput.Control>
            <TagsInput.Items />
            <TagsInput.Input placeholder="Disabled input" />
          </TagsInput.Control>
        </TagsInput.Root>
        <TagsInput.Root readOnly defaultValue={['Readonly']}>
          <TagsInput.Label>Readonly tags</TagsInput.Label>
          <TagsInput.Control>
            <TagsInput.Items />
            <TagsInput.Input placeholder="Readonly input" />
          </TagsInput.Control>
        </TagsInput.Root>
        <TagsInput.Root required invalid>
          <TagsInput.Label>Required tags</TagsInput.Label>
          <TagsInput.Control>
            <TagsInput.Items />
            <TagsInput.Input placeholder="Required input" />
          </TagsInput.Control>
          <TagsInput.HiddenInput />
        </TagsInput.Root>
        <TagsInput.PropsProvider value={{ size: 'lg' }}>
          <TagsInput.RootProvider value={machine} data-testid="tags-input-provider-root">
            <TagsInput.Label>External tags</TagsInput.Label>
            <TagsInput.Control>
              <TagsInput.Items />
              <TagsInput.Input placeholder="External input" />
            </TagsInput.Control>
          </TagsInput.RootProvider>
        </TagsInput.PropsProvider>
      </div>
    </>
  );
}

const meta = {
  title: 'Components/Tags Input',
  component: TagsInputContractExample,
} satisfies Meta<typeof TagsInputContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Contract: Story = { render: TagsInputContractExample };
export const States: Story = { render: TagsInputStatesExample };
