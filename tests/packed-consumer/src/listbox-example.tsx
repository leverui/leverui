import { Listbox, createListCollection, type ListboxValueChangeDetails } from '@leverui/components';
import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { gridCollection } from './listbox-grid';

const frameworks = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
];
const collection = createListCollection({ items: frameworks });

/** Exercise packaged Listbox selection and a plain consumer stylesheet. */
export function PackedListbox(): JSX.Element {
  const [selected, setSelected] = createSignal<string[]>([]);

  /** Record the current selection outside the installed machine. */
  function handleValueChange(details: ListboxValueChangeDetails): void {
    setSelected(details.value);
  }

  return (
    <Listbox.Root
      collection={collection}
      variant="solid"
      class="packed-listbox"
      onValueChange={handleValueChange}
      data-testid="packed-listbox-root"
    >
      <Listbox.Label>Packed frameworks</Listbox.Label>
      <Listbox.Content>
        <Listbox.List>
          <For each={frameworks}>
            {
              /** Keep published option props tied to the package collection. */
              (item) => (
                <Listbox.Item item={item} data-testid={`packed-listbox-${item.value}`}>
                  <Listbox.ItemText>{item.label}</Listbox.ItemText>
                  <Listbox.ItemIndicator />
                </Listbox.Item>
              )
            }
          </For>
        </Listbox.List>
      </Listbox.Content>
      <output data-testid="packed-listbox-value">{selected().join(',')}</output>
      <output data-testid="packed-listbox-grid-next-row">
        {gridCollection.getNextRowValue('one')}
      </output>
    </Listbox.Root>
  );
}
