import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Combobox, Portal, useFilter, useListCollection } from '../../src';
import { comboboxCountries, countryFlag } from './combobox-country-collection';

/** Limit the searchable country collection to ten visible results. */
export function ComboboxLimitExample(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter, reset } = useListCollection({
    initialItems: comboboxCountries,
    filter:
      /** Keep only country labels that begin with the query. */
      (item, query) => matcher().startsWith(item, query),
    limit: 10,
  });

  /** Filter the country list as the visitor types. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  return (
    <Combobox.Root
      collection={collection()}
      onInputValueChange={changeInput}
      openOnClick
      style={{ width: '320px' }}
    >
      <Combobox.Label>Select country</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger onClick={reset} />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.List>
              <For each={collection().items}>
                {
                  /** Show a flag and truncated country label for each result. */
                  (item) => (
                    <Combobox.Item item={item}>
                      <Combobox.ItemText
                        style={{
                          overflow: 'hidden',
                          'text-overflow': 'ellipsis',
                          'white-space': 'nowrap',
                        }}
                      >
                        <span aria-hidden="true" style={{ 'margin-right': '4px' }}>
                          {countryFlag(item.value)}
                        </span>
                        {item.label}
                      </Combobox.ItemText>
                      <Combobox.ItemIndicator />
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
