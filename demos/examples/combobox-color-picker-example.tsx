import { createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  ColorSwatch,
  Combobox,
  HStack,
  Stack,
  Text,
  useFilter,
  useListCollection,
} from '../../src';

const colors = [
  { id: 'red', name: 'Red', value: '#EF4444' },
  { id: 'blue', name: 'Blue', value: '#3B82F6' },
  { id: 'green', name: 'Green', value: '#10B981' },
  { id: 'purple', name: 'Purple', value: '#8B5CF6' },
  { id: 'yellow', name: 'Yellow', value: '#F59E0B' },
  { id: 'pink', name: 'Pink', value: '#EC4899' },
];

type ColorItem = (typeof colors)[number];

/** Pair searchable color names with a preview of the selected swatch. */
export function ComboboxColorPickerExample(): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const [selectedColor, setSelectedColor] = createSignal<ColorItem | null>(null);
  const { collection, filter } = useListCollection({
    initialItems: colors,
    filter:
      /** Match color names without case sensitivity. */
      (item, query) => matcher().contains(item, query),
    itemToValue:
      /** Select colors by their stable identifier. */
      (item) => item.id,
    itemToString:
      /** Show the color name in the input. */
      (item) => item.name,
  });

  /** Mirror the selected item into the external swatch. */
  function changeValue(details: { items: ColorItem[] }): void {
    setSelectedColor(details.items[0] ?? null);
  }

  /** Filter the visible color collection. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  return (
    <Combobox.Root
      style={{ 'max-width': '320px' }}
      collection={collection()}
      onValueChange={changeValue}
      onInputValueChange={changeInput}
    >
      <Combobox.Label class="lui-visually-hidden">Select color</Combobox.Label>
      <Stack direction="row" align="center" gap="3">
        <Combobox.Control>
          <Combobox.Input placeholder="Color" />
          <Combobox.IndicatorGroup>
            <Combobox.ClearTrigger />
            <Combobox.Trigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>
        <Show when={selectedColor()}>
          {
            /** Preview the currently selected color next to the input. */
            (color) => <ColorSwatch value={color().value} />
          }
        </Show>
      </Stack>
      <Combobox.Content>
        <Combobox.List>
          <Combobox.ItemGroup>
            <Combobox.ItemGroupLabel>Color</Combobox.ItemGroupLabel>
            <For each={collection().items}>
              {
                /** Render each color's swatch, name, and hexadecimal value. */
                (color) => (
                  <Combobox.Item item={color}>
                    <HStack direction="row" gap="3" align="center">
                      <ColorSwatch
                        value={color.value}
                        style={{
                          width: 'var(--lui-sizes-6)',
                          height: 'var(--lui-sizes-6)',
                        }}
                      />
                      <HStack gap="1" style={{ flex: '1' }}>
                        <Text style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>
                          {color.name}
                        </Text>
                        <Text
                          textStyle="sm"
                          style={{
                            color: 'var(--lui-colors-fg-muted)',
                          }}
                        >
                          {color.value}
                        </Text>
                      </HStack>
                    </HStack>
                    <Combobox.ItemIndicator />
                  </Combobox.Item>
                )
              }
            </For>
          </Combobox.ItemGroup>
        </Combobox.List>
      </Combobox.Content>
    </Combobox.Root>
  );
}
