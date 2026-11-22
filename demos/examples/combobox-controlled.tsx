import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Badge, Combobox, HStack, Portal, useFilter, useListCollection } from '../../src';
import { frameworks } from './combobox-framework-data';
import './combobox-examples.css';

/** Hold the selected values in a Solid signal and list them above the field. */
export function ComboboxControlled(): JSX.Element {
  const [value, setValue] = createSignal<string[]>([]);
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels using locale-aware case folding. */
      (text, query) => matcher().contains(text, query),
  });

  return (
    <Combobox.Root
      value={value()}
      onValueChange={
        /** Store the machine's next selection. */
        (details) => setValue(details.value)
      }
      collection={collection()}
      onInputValueChange={
        /** Keep the filtered collection in sync with input changes. */
        (details) => filter(details.inputValue)
      }
      style={{ width: '320px' }}
    >
      <HStack textStyle="sm" class="example-combobox-caption">
        Selected:
        <HStack>
          <For each={value()} fallback="N/A">
            {(selected) => <Badge>{selected}</Badge>}
          </For>
        </HStack>
      </HStack>
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

/** Hold the open state in a Solid signal and reflect it in the label. */
export function ComboboxOpenControlled(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels using locale-aware case folding. */
      (text, query) => matcher().contains(text, query),
  });

  return (
    <Combobox.Root
      open={open()}
      onOpenChange={
        /** Store the machine's next open state. */
        (details) => setOpen(details.open)
      }
      collection={collection()}
      onInputValueChange={
        /** Keep the filtered collection in sync with input changes. */
        (details) => filter(details.inputValue)
      }
      style={{ width: '320px' }}
    >
      <Combobox.Label>{`Combobox is ${open() ? 'open' : 'closed'}`}</Combobox.Label>
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
