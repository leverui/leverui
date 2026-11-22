import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Combobox, Highlight, Portal, useFilter, useListCollection } from '../../src';
import { frameworks } from './combobox-framework-data';
import './highlight-styles.css';

/** Highlight the typed query inside each filtered framework option. */
export function ComboboxHighlightExample(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const [query, setQuery] = createSignal('');
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels without case sensitivity. */
      (item, search) => matcher().contains(item, search),
  });

  /** Keep filtering and highlighting tied to the same query. */
  function changeInput(details: { inputValue: string }): void {
    setQuery(details.inputValue);
    filter(details.inputValue);
  }

  return (
    <Combobox.Root
      collection={collection()}
      onInputValueChange={changeInput}
      style={{ width: '320px' }}
    >
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
            <Combobox.Empty>No items found</Combobox.Empty>
            <Combobox.List>
              <For each={collection().items}>
                {
                  /** Mark matching text in each rendered option. */
                  (item) => (
                    <Combobox.Item item={item}>
                      <Combobox.ItemText>
                        <Highlight ignoreCase query={query()} markClass="highlight-example-yellow">
                          {item.label}
                        </Highlight>
                      </Combobox.ItemText>
                    </Combobox.Item>
                  )
                }
              </For>
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
}
