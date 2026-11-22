import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Combobox, Field, Portal, useListCollection } from '../src';

const frameworks = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
];

/** Exercise selection, filtering, portals, forms, Field state, and CSS choices. */
function ComboboxContractExample(): JSX.Element {
  const [large, setLarge] = createSignal(false);
  const [invalid, setInvalid] = createSignal(false);
  const [selected, setSelected] = createSignal<string[]>([]);
  const [open, setOpen] = createSignal(false);
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    /** Keep the list aligned with the visible input text. */
    filter: (itemText, filterText) => itemText.toLowerCase().includes(filterText.toLowerCase()),
  });

  /** Follow the input's current filter text. */
  function handleInputChange(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  /** Record the selected value for browser contract checks. */
  function handleValueChange(details: { value: string[] }): void {
    setSelected(details.value);
  }

  /** Record the popup's current open state. */
  function handleOpenChange(details: { open: boolean }): void {
    setOpen(details.open);
  }

  /** Change appearance and validation without replacing the native input. */
  function togglePresentation(): void {
    setLarge(!large());
    setInvalid(!invalid());
  }

  return (
    <>
      <form data-testid="combobox-form">
        <Field.Root id="framework-field" required invalid={invalid()}>
          <Combobox.Root
            collection={collection()}
            name="framework"
            size={large() ? 'lg' : 'sm'}
            variant={large() ? 'subtle' : 'outline'}
            onInputValueChange={handleInputChange}
            onValueChange={handleValueChange}
            onOpenChange={handleOpenChange}
            data-testid="combobox-root"
          >
            <Combobox.Label>Framework</Combobox.Label>
            <Combobox.Control data-testid="combobox-control">
              <Combobox.Input data-testid="combobox-input" placeholder="Choose a framework" />
              <Combobox.IndicatorGroup>
                <Combobox.ClearTrigger aria-label="Clear framework" />
                <Combobox.Trigger aria-label="Show frameworks" data-testid="combobox-trigger" />
              </Combobox.IndicatorGroup>
            </Combobox.Control>
            <Portal>
              <Combobox.Positioner data-testid="combobox-positioner">
                <Combobox.Content data-testid="combobox-content">
                  <Combobox.Empty>No matching frameworks</Combobox.Empty>
                  <Combobox.List>
                    <Combobox.ItemGroup>
                      <Combobox.ItemGroupLabel>Popular frameworks</Combobox.ItemGroupLabel>
                      <For each={collection().items}>
                        {
                          /** Render machine items from the same filtered collection. */
                          (item) => (
                            <Combobox.Item item={item} data-testid={`item-${item.value}`}>
                              <Combobox.ItemText>{item.label}</Combobox.ItemText>
                              <Combobox.ItemIndicator />
                            </Combobox.Item>
                          )
                        }
                      </For>
                    </Combobox.ItemGroup>
                  </Combobox.List>
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
          <Field.HelperText>Choose one</Field.HelperText>
          <Field.ErrorText>Framework is required</Field.ErrorText>
        </Field.Root>
      </form>
      <output data-testid="selected-value">{selected().join(',')}</output>
      <output data-testid="open-state">{open() ? 'open' : 'closed'}</output>
      <button type="button" onClick={togglePresentation} data-testid="toggle-presentation">
        Toggle presentation
      </button>
    </>
  );
}

const meta = {
  title: 'Components/Combobox',
  component: ComboboxContractExample,
} satisfies Meta<typeof ComboboxContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
