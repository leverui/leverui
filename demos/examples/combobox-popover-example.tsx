import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Button, Combobox, Popover, Portal, useFilter, useListCollection } from '../../src';
import { frameworks } from './combobox-framework-data';

/** Search framework options inside an open popover. */
function PopoverCombobox(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: frameworks,
    filter:
      /** Match framework labels without case sensitivity. */
      (item, query) => matcher().contains(item, query),
  });

  /** Filter the nested Combobox when its input changes. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  return (
    <Combobox.Root collection={collection()} onInputValueChange={changeInput}>
      <Combobox.Control>
        <Combobox.Input placeholder="Type to search" />
        <Combobox.IndicatorGroup>
          <Combobox.ClearTrigger />
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Combobox.Positioner>
        <Combobox.Content>
          <Combobox.Empty>No items found</Combobox.Empty>
          <Combobox.List>
            <For each={collection().items}>
              {
                /** Render each filtered option in the nested popup. */
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
    </Combobox.Root>
  );
}

/** Open the Combobox from the small popover. */
export function ComboboxPopoverExample(): JSX.Element {
  return (
    <Popover.Root size="xs">
      <Popover.Trigger
        asChild={
          /** Make the outline button the popover trigger. */
          (getProps) => (
            <Button {...getProps()} variant="outline" size="sm">
              Toggle popover
            </Button>
          )
        }
      />
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Header>Select framework</Popover.Header>
            <Popover.Body>
              <PopoverCombobox />
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}
