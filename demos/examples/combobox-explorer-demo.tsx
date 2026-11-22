import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Combobox, createListCollection, Stack, useFilter, useListCollection } from '../../src';

const frameworks = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Preact', value: 'preact' },
  { label: 'Qwik', value: 'qwik' },
  { label: 'Lit', value: 'lit' },
  { label: 'Alpine.js', value: 'alpinejs' },
  { label: 'Ember', value: 'ember' },
  { label: 'Next.js', value: 'nextjs' },
];

const noResults = createListCollection({ items: [] });

/** Render every Combobox anatomy part in an always-open list for the part Explorer. */
export function ComboboxExplorerDemo(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels without case sensitivity. */
      (text, query) => matcher().contains(text, query),
  });

  /** Filter the list as the visitor types. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  /** Render one group's options from the current collection. */
  function Items(props: { items: (typeof frameworks)[number][] }): JSX.Element {
    return (
      <For each={props.items}>
        {
          /** Bind each option to its collection item. */
          (item) => (
            <Combobox.Item item={item}>
              <Combobox.ItemText>{item.label}</Combobox.ItemText>
              <Combobox.ItemIndicator />
            </Combobox.Item>
          )
        }
      </For>
    );
  }

  return (
    <Stack style={{ 'max-width': '320px' }}>
      <Combobox.Root collection={collection()} onInputValueChange={changeInput} open>
        <Combobox.Label
          style={{
            'margin-bottom': 'var(--leverui-spacing-2)',
            'font-weight': 'var(--leverui-font-weights-medium)',
          }}
        >
          Select framework
        </Combobox.Label>
        <Combobox.Control>
          <Combobox.Input placeholder="Type to search" />
          <Combobox.IndicatorGroup>
            <Combobox.ClearTrigger aria-label="Clear input" />
            <Combobox.Trigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            <Combobox.List>
              <Combobox.ItemGroup>
                <Combobox.ItemGroupLabel>Popular</Combobox.ItemGroupLabel>
                <Items items={collection().items.slice(0, 3)} />
              </Combobox.ItemGroup>
              <Combobox.ItemGroup>
                <Combobox.ItemGroupLabel>Others</Combobox.ItemGroupLabel>
                <Items items={collection().items.slice(3)} />
              </Combobox.ItemGroup>
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </Combobox.Root>
      <Combobox.Root collection={noResults}>
        <Combobox.Empty>No items found</Combobox.Empty>
      </Combobox.Root>
    </Stack>
  );
}
