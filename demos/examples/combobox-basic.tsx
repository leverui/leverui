import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Combobox, Portal, useFilter, useListCollection } from '../../src';
import { frameworks } from './combobox-framework-data';

/** Show a searchable framework picker with single selection. */
export function ComboboxBasic(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels using locale-aware case folding. */
      (text, query) => matcher().contains(text, query),
  });

  return (
    <Combobox.Root
      collection={collection()}
      onInputValueChange={
        /** Keep the filtered collection in sync with input changes. */
        (details) => filter(details.inputValue)
      }
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
                {(item) => (
                  <Combobox.Item item={item}>
                    {item.label}
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                )}
              </For>
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
}

/** Open the list when the visitor clicks the input. */
export function ComboboxOpenOnClick(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels using locale-aware case folding. */
      (text, query) => matcher().contains(text, query),
  });

  return (
    <Combobox.Root
      openOnClick
      collection={collection()}
      onInputValueChange={
        /** Keep the filtered collection in sync with input changes. */
        (details) => filter(details.inputValue)
      }
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
                {(item) => (
                  <Combobox.Item item={item}>
                    {item.label}
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                )}
              </For>
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
}

/** Open the list only after three characters are typed. */
export function ComboboxMinCharacter(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels using locale-aware case folding. */
      (text, query) => matcher().contains(text, query),
  });

  return (
    <Combobox.Root
      openOnChange={
        /** Require a three-character query before opening. */
        (details) => details.inputValue.length > 2
      }
      collection={collection()}
      onInputValueChange={
        /** Keep the filtered collection in sync with input changes. */
        (details) => filter(details.inputValue)
      }
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
                {(item) => (
                  <Combobox.Item item={item}>
                    {item.label}
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                )}
              </For>
            </Combobox.List>
          </Combobox.Content>
        </Combobox.Positioner>
      </Portal>
    </Combobox.Root>
  );
}
