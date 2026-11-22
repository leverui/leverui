import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  Avatar,
  Combobox,
  HStack,
  Portal,
  Span,
  Stack,
  useFilter,
  useListCollection,
} from '../../src';
import { carBrands } from './combobox-car-data';

type CarBrand = (typeof carBrands)[number];

/** Search car brands and display the selected brands below the Combobox. */
export function ComboboxCustomItemExample(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const [selected, setSelected] = createSignal<readonly CarBrand[]>([]);
  const { collection, filter } = useListCollection({
    initialItems: carBrands,
    filter:
      /** Match brand labels without case sensitivity. */
      (item, query) => matcher().contains(item, query),
  });

  /** Keep the visible brand list filtered. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  /** Save selected brand objects for the preview cards. */
  function changeValue(details: { items: CarBrand[] }): void {
    setSelected(details.items);
  }

  return (
    <Combobox.Root
      collection={collection()}
      onInputValueChange={changeInput}
      onValueChange={changeValue}
      style={{ width: '320px' }}
      multiple
      closeOnSelect
    >
      <Combobox.Label>Search and select car brands</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder="Example: Audi" />
        <Combobox.IndicatorGroup>
          <Combobox.Trigger />
        </Combobox.IndicatorGroup>
      </Combobox.Control>
      <Stack style={{ 'margin-top': 'var(--leverui-spacing-2)' }}>
        <For each={selected()}>
          {
            /** Show the selected brand's initials badge and name in a bordered row. */
            (item) => (
              <HStack
                textStyle="sm"
                style={{
                  padding: 'var(--leverui-spacing-1)',
                  'border-width': '1px',
                }}
              >
                <Avatar.Root
                  size="sm"
                  shape="rounded"
                  variant="subtle"
                  aria-hidden="true"
                  style={{ margin: 'var(--leverui-spacing-1)' }}
                >
                  <Avatar.Fallback name={item.label} />
                </Avatar.Root>
                <span>{item.label}</span>
              </HStack>
            )
          }
        </For>
      </Stack>
      <Portal>
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>No items found</Combobox.Empty>
            <Combobox.List>
              <For each={collection().items}>
                {
                  /** Pair each option with its brand initials badge. */
                  (item) => (
                    <Combobox.Item item={item}>
                      <Avatar.Root size="2xs" shape="rounded" variant="subtle" aria-hidden="true">
                        <Avatar.Fallback name={item.label} />
                      </Avatar.Root>
                      <Span style={{ flex: '1' }}>{item.label}</Span>
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
