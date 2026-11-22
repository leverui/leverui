import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { Portal, Select } from '../src';

const frameworks = Select.createListCollection({
  items: [
    { label: 'React', value: 'react' },
    { label: 'Solid', value: 'solid' },
    { label: 'Vue', value: 'vue', disabled: true },
  ],
});

/** Render the same typed collection under each machine state. */
function FrameworkOptions(): JSX.Element {
  return (
    <For each={frameworks.items}>
      {
        /** Keep each primitive item bound to its collection object. */
        (item) => (
          <Select.Item item={item} data-testid={`select-item-${item.value}`}>
            <Select.ItemText>{item.label}</Select.ItemText>
            <Select.ItemIndicator />
          </Select.Item>
        )
      }
    </For>
  );
}

/** Exercise controlled selection, form data, clear action, and live size. */
function SelectContractExample(): JSX.Element {
  const [value, setValue] = createSignal<string[]>([]);
  const [large, setLarge] = createSignal(false);

  /** Keep the selected value owned by a Solid signal. */
  function handleValueChange(details: { value: string[] }): void {
    setValue(details.value);
  }

  /** Change the finite size without replacing the Select machine. */
  function toggleSize(): void {
    setLarge(!large());
  }

  return (
    <>
      <form data-testid="select-form" style={{ width: '360px', padding: '24px' }}>
        <Select.Root
          collection={frameworks}
          name="framework"
          value={value()}
          onValueChange={handleValueChange}
          size={large() ? 'lg' : 'sm'}
          data-testid="select-root"
        >
          <Select.HiddenSelect />
          <Select.Label>Framework</Select.Label>
          <Select.Control>
            <Select.Trigger data-testid="select-trigger">
              <Select.ValueText placeholder="Choose a framework" />
            </Select.Trigger>
            <Select.IndicatorGroup>
              <Select.ClearTrigger aria-label="Clear framework" />
              <Select.Indicator />
            </Select.IndicatorGroup>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.List>
                  <Select.ItemGroup>
                    <Select.ItemGroupLabel>Popular frameworks</Select.ItemGroupLabel>
                    <FrameworkOptions />
                  </Select.ItemGroup>
                </Select.List>
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
        <output data-testid="select-value">{value().join(',')}</output>
        <button type="button" onClick={toggleSize} data-testid="select-size-toggle">
          Toggle size
        </button>
      </form>
    </>
  );
}

/** Exercise disabled, readonly, and multiple selection branches. */
function SelectStatesExample(): JSX.Element {
  return (
    <>
      <form data-testid="select-states-form">
        <Select.Root collection={frameworks} name="disabled" disabled>
          <Select.HiddenSelect />
          <Select.Label>Disabled</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText placeholder="Disabled" />
            </Select.Trigger>
          </Select.Control>
        </Select.Root>
        <Select.Root collection={frameworks} name="readonly" readOnly defaultValue={['react']}>
          <Select.HiddenSelect />
          <Select.Label>Readonly</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText />
            </Select.Trigger>
          </Select.Control>
        </Select.Root>
        <Select.Root collection={frameworks} name="multiple" multiple defaultValue={['react']}>
          <Select.HiddenSelect />
          <Select.Label>Multiple</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText />
            </Select.Trigger>
          </Select.Control>
          <Portal>
            <Select.Positioner>
              <Select.Content>
                <Select.List>
                  <FrameworkOptions />
                </Select.List>
              </Select.Content>
            </Select.Positioner>
          </Portal>
        </Select.Root>
      </form>
    </>
  );
}

const meta = {
  title: 'Components/Select',
  component: SelectContractExample,
} satisfies Meta<typeof SelectContractExample>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Contract: Story = {};
export const States: Story = { render: SelectStatesExample };
