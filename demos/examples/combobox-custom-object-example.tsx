import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Combobox, Portal, useFilter, useListCollection } from '../../src';
import { objectCountries } from './combobox-country-data';

/** Search objects by country name while using their code as the machine value. */
export function ComboboxCustomObjectExample(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: objectCountries,
    itemToString:
      /** Show the country name in the input. */
      (item) => item.country,
    itemToValue:
      /** Keep the country code as the selected value. */
      (item) => item.code,
    filter:
      /** Match country names without case sensitivity. */
      (item, query) => matcher().contains(item, query),
  });

  /** Filter countries when the query changes. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  return (
    <Combobox.Root collection={collection()} onInputValueChange={changeInput}>
      <Combobox.Label>Search countries</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="e.g. United States" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            <Combobox.List>
              <For each={collection().items}>
                {
                  /** Render the country name without its flag. */
                  (item) => <Combobox.Item item={item}>{item.country}</Combobox.Item>
                }
              </For>
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
}
