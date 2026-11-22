import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Combobox, Portal, useFilter, useListCollection } from '../../src';
import { frameworks } from './combobox-framework-data';

/** Drive the framework picker through an external Combobox store. */
export function ComboboxStoreExample(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels without case sensitivity. */
      (item, query) => matcher().contains(item, query),
  });

  /** Keep the external store's collection filtered. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  /** Supply the current collection to the reactive external store. */
  function storeProps() {
    return { collection: collection(), onInputValueChange: changeInput };
  }

  const store = Combobox.useCombobox(storeProps);

  return (
    <Combobox.RootProvider value={store} style={{ width: '320px' }}>
      <Combobox.Label>Select framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
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
                  /** Render each item from the store's current collection. */
                  (item) => (
                    <Combobox.Item item={item}>
                      {item.label}
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
