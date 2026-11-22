import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Portal, Select } from '../../src';

const cities = Select.createListCollection({
  items: [
    { label: 'London', value: 'london' },
    { label: 'Paris', value: 'paris' },
    { label: 'Tokyo', value: 'tokyo' },
    { label: 'New York', value: 'new-york' },
  ],
});

/** Show a single Select with four cities. */
export function SelectBasic(): JSX.Element {
  return (
    <Select.Root collection={cities} size="sm" style={{ width: '320px' }}>
      <Select.HiddenSelect />
      <Select.Label>Select city</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select city" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            <Select.List>
              <For each={cities.items}>
                {(city) => (
                  <Select.Item item={city}>
                    {city.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                )}
              </For>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}

const currencies = Select.createListCollection({
  items: [
    { label: 'US dollar', value: 'us-dollar' },
    { label: 'Euro', value: 'euro' },
    { label: 'Japanese yen', value: 'japanese-yen' },
    { label: 'British pound', value: 'british-pound' },
  ],
});

/** Keep selected currency values in a Solid signal. */
export function SelectControlled(): JSX.Element {
  const [value, setValue] = createSignal<string[]>([]);

  return (
    <Select.Root
      collection={currencies}
      style={{ width: '320px' }}
      value={value()}
      onValueChange={
        /** Follow the public machine's next value array. */
        (details) => setValue(details.value)
      }
    >
      <Select.HiddenSelect />
      <Select.Label>Select currency</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select currency" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            <Select.List>
              <For each={currencies.items}>
                {(currency) => (
                  <Select.Item item={currency}>
                    {currency.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                )}
              </For>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}

const colors = Select.createListCollection({
  items: [
    { label: 'Red', value: 'red' },
    { label: 'Green', value: 'green' },
    { label: 'Blue', value: 'blue' },
    { label: 'Yellow', value: 'yellow' },
  ],
});

/** Allow more than one color to stay selected. */
export function SelectMultiple(): JSX.Element {
  return (
    <Select.Root multiple collection={colors} size="sm" style={{ width: '320px' }}>
      <Select.HiddenSelect />
      <Select.Label>Select colors</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select colors" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            <Select.List>
              <For each={colors.items}>
                {(color) => (
                  <Select.Item item={color}>
                    {color.label}
                    <Select.ItemIndicator />
                  </Select.Item>
                )}
              </For>
            </Select.List>
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
