import { Select, type SelectValueChangeDetails } from '@leverui/components';
import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';

const collection = Select.createListCollection({
  items: [
    { label: 'React', value: 'react' },
    { label: 'Solid', value: 'solid' },
  ],
});

/** Exercise the installed Select's controlled form and CSS hooks. */
export function PackedSelect(): JSX.Element {
  const [value, setValue] = createSignal<string[]>([]);

  /** Keep consumer state in sync with the installed machine. */
  function handleValueChange(details: SelectValueChangeDetails): void {
    setValue(details.value);
  }

  return (
    <form data-testid="packed-select-form">
      <Select.Root
        collection={collection}
        name="framework"
        value={value()}
        onValueChange={handleValueChange}
        class="packed-select"
        data-testid="packed-select-root"
      >
        <Select.HiddenSelect />
        <Select.Label>Framework</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="Choose framework" />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.ClearTrigger />
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Select.Positioner>
          <Select.Content>
            <Select.List>
              <For each={collection.items}>
                {
                  /** Render each installed collection item with its typed value. */
                  (item) => <Select.Item item={item}>{item.label}</Select.Item>
                }
              </For>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Select.Root>
      <output data-testid="packed-select-value">{value().join(',')}</output>
    </form>
  );
}
