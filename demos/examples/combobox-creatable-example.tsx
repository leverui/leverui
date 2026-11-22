import { createMemo, createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Combobox, createListCollection, HStack, Portal, Span, useFilter } from '../../src';

interface CreatableItem {
  label: string;
  value: string;
  isNew?: boolean;
}

const createValue = '[[new]]';
const initialItems: CreatableItem[] = [
  { label: 'React', value: 'react' },
  { label: 'Solid', value: 'solid' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
];

/** Search frameworks and create a new option from unmatched input. */
export function ComboboxCreatableExample(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const [items, setItems] = createSignal<CreatableItem[]>(initialItems);
  const [query, setQuery] = createSignal('');
  const [selectedValue, setSelectedValue] = createSignal<string[]>([]);

  /** Check whether the typed label would create a distinct item. */
  function canCreate(input: string): boolean {
    const name = input.trim();
    if (!name) return false;
    return !items().some(
      /** Ignore case when checking existing labels. */
      (item) => item.label.toLowerCase() === name.toLowerCase(),
    );
  }

  const visibleItems = createMemo(
    /** Prepend a create option to matching existing frameworks. */
    () => {
      const input = query();
      const matches = items().filter(
        /** Keep labels containing the current query. */
        (item) => matcher().contains(item.label, input),
      );
      return canCreate(input) ? [{ label: input, value: createValue }, ...matches] : matches;
    },
  );
  const collection = createMemo(
    /** Rebuild the collection whenever filtering or creation changes. */
    () =>
      createListCollection({
        items: visibleItems(),
        itemToString:
          /** Show item labels in the input. */
          (item) => item.label,
        itemToValue:
          /** Keep the create sentinel distinct from saved item values. */
          (item) => item.value,
      }),
  );

  /** Filter when the visitor types or selects an item. */
  function changeInput(details: { inputValue: string; reason?: string | undefined }): void {
    if (details.reason === 'input-change' || details.reason === 'item-select') {
      setQuery(details.inputValue);
    }
  }

  /** Replace the temporary create option with a persistent selected item. */
  function changeValue(details: { value: string[] }): void {
    if (!details.value.includes(createValue)) {
      setSelectedValue(details.value);
      return;
    }
    const label = query().trim();
    if (!canCreate(label)) return;
    setItems([{ label, value: label, isNew: true }, ...items()]);
    setSelectedValue(
      details.value.map(
        /** Replace only the create sentinel in the controlled value. */
        (value) => (value === createValue ? label : value),
      ),
    );
  }

  /** Restore the full list on trigger click and the selected label on close. */
  function changeOpen(details: { open: boolean; reason?: string | undefined }): void {
    if (details.reason === 'trigger-click') setQuery('');
    if (!details.open && selectedValue().length > 0) {
      store().setInputValue(selectedValue()[0] ?? '');
    }
  }

  /** Supply the current collection and controlled value to the machine. */
  function storeProps() {
    return {
      collection: collection(),
      allowCustomValue: true,
      value: selectedValue(),
      onInputValueChange: changeInput,
      onValueChange: changeValue,
      onOpenChange: changeOpen,
    };
  }

  const store = Combobox.useCombobox(storeProps);

  return (
    <Combobox.RootProvider value={store} style={{ 'max-width': '320px' }}>
      <Combobox.Label>Choose framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Search or create..." />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.List>
              <For each={collection().items}>
                {
                  /** Distinguish the temporary create option from saved items. */
                  (item) => (
                    <Combobox.Item item={item}>
                      <Show
                        when={item.value !== createValue}
                        fallback={
                          <Combobox.ItemText>{`+ Create "${item.label}"`}</Combobox.ItemText>
                        }
                      >
                        <HStack justify="space-between" style={{ flex: '1' }}>
                          <Combobox.ItemText style={{ flex: '0' }}>{item.label}</Combobox.ItemText>
                          {item.isNew && <Span textStyle="xs">NEW</Span>}
                        </HStack>
                      </Show>
                      <Combobox.ItemIndicator />
                    </Combobox.Item>
                  )
                }
              </For>
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.RootProvider>
  );
}
