import {
  Combobox,
  Portal,
  createListCollection,
  type ComboboxValueChangeDetails,
} from '@leverui/components';
import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';

const frameworks = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
];
const collection = createListCollection({ items: frameworks });

/** Exercise packaged selection, form values, and consumer CSS. */
export function PackedCombobox(): JSX.Element {
  const [selected, setSelected] = createSignal<string[]>([]);

  /** Record the selected key independently of the input's display text. */
  function handleValueChange(details: ComboboxValueChangeDetails): void {
    setSelected(details.value);
  }

  return (
    <form data-testid="packed-combobox-form">
      <Combobox.Root
        collection={collection}
        name="packed-combobox"
        size="sm"
        class="packed-combobox"
        onValueChange={handleValueChange}
        data-testid="packed-combobox-root"
      >
        <Combobox.Label>Packed framework</Combobox.Label>
        <Combobox.Control>
          <Combobox.Input data-testid="packed-combobox-input" />
          <Combobox.IndicatorGroup>
            <Combobox.Trigger aria-label="Show packed frameworks" />
          </Combobox.IndicatorGroup>
        </Combobox.Control>
        <Portal>
          <Combobox.Positioner>
            <Combobox.Content>
              <Combobox.List>
                <For each={frameworks}>
                  {
                    /** Keep rendered options aligned with the machine collection. */
                    (item) => <Combobox.Item item={item}>{item.label}</Combobox.Item>
                  }
                </For>
              </Combobox.List>
            </Combobox.Content>
          </Combobox.Positioner>
        </Portal>
      </Combobox.Root>
      <output data-testid="packed-combobox-value">{selected().join(',')}</output>
    </form>
  );
}
