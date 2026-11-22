import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CodeIcon } from '@lucide/solid';
import { Combobox, InputGroup, Portal, useFilter, useListCollection } from '../../src';
import { frameworks } from './combobox-framework-data';

/** Disable the whole Combobox. */
export function ComboboxDisabled(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels using locale-aware case folding. */
      (text, query) => matcher().contains(text, query),
  });

  return (
    <Combobox.Root
      disabled
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

/** Show the Combobox error state. */
export function ComboboxInvalid(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels using locale-aware case folding. */
      (text, query) => matcher().contains(text, query),
  });

  return (
    <Combobox.Root
      invalid
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

/** Add a leading icon with InputGroup. */
export function ComboboxWithInputGroup(): JSX.Element {
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
        <InputGroup startElement={<CodeIcon />}>
          <Combobox.Input placeholder="Type to search" />
        </InputGroup>
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
