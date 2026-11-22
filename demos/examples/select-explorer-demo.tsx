import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Select } from '../../src';

const drinkItems = [
  { label: 'Coffee', value: 'coffee' },
  { label: 'Tea', value: 'tea' },
  { label: 'Juice', value: 'juice' },
  { label: 'Water', value: 'water' },
] as const;
const drinks = Select.createListCollection({ items: drinkItems });

/** Render one group's options for the part Explorer. */
function ExplorerItems(props: { items: readonly (typeof drinkItems)[number][] }): JSX.Element {
  return (
    <For each={props.items}>
      {
        /** Bind each option to its collection item. */
        (item) => (
          <Select.Item item={item}>
            <Select.ItemText>{item.label}</Select.ItemText>
            <Select.ItemIndicator />
          </Select.Item>
        )
      }
    </For>
  );
}

/** Render every Select anatomy part in an always-open popup for the part Explorer. */
export function SelectExplorerDemo(): JSX.Element {
  return (
    <Select.Root
      collection={drinks}
      size="sm"
      style={{ width: '320px' }}
      defaultValue={['react']}
      open
    >
      <Select.HiddenSelect />
      <Select.Label>Select drink</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select drink" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.ClearTrigger aria-label="Clear selection" />
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          <Select.List>
            <Select.ItemGroup>
              <Select.ItemGroupLabel>Popular</Select.ItemGroupLabel>
              <ExplorerItems items={drinkItems.slice(0, 2)} />
            </Select.ItemGroup>
            <Select.ItemGroup>
              <Select.ItemGroupLabel>Others</Select.ItemGroupLabel>
              <ExplorerItems items={drinkItems.slice(2)} />
            </Select.ItemGroup>
          </Select.List>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
}
