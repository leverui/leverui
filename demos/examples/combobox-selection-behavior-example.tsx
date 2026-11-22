import { For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { Box, Combobox, Heading, Stack, Text, useFilter, useListCollection } from '../../src';

const companies = [
  { label: 'Apple', value: 'apple' },
  { label: 'Amazon', value: 'amazon' },
  { label: 'Meta', value: 'meta' },
  { label: 'Netflix', value: 'netflix' },
  { label: 'Google', value: 'google' },
];

const descriptions = {
  replace: 'The selected item replaces what you typed',
  clear: 'The input is cleared after you select an item',
  preserve: 'What you typed stays after you select an item',
} as const;

type SelectionBehavior = keyof typeof descriptions;

/** Show how one Combobox selection mode updates its input. */
function ComboboxSelectionDemo(props: { behavior: SelectionBehavior }): JSX.Element {
  const matcher = useFilter({ sensitivity: 'base' });
  const { collection, filter } = useListCollection({
    initialItems: companies,
    filter:
      /** Match company labels ignoring case. */
      (item, query) => matcher().contains(item, query),
  });

  /** Filter the company list as a visitor types. */
  function changeInput(details: { inputValue: string }): void {
    filter(details.inputValue);
  }

  return (
    <Box>
      <Stack style={{ 'margin-bottom': 'var(--leverui-spacing-4)' }}>
        <Heading as="h3">Selection behavior: {props.behavior}</Heading>
        <Text
          textStyle="sm"
          style={{
            color: 'var(--leverui-colors-gray-600)',
          }}
        >
          {descriptions[props.behavior]}
        </Text>
      </Stack>
      <Combobox.Root
        collection={collection()}
        selectionBehavior={props.behavior}
        onInputValueChange={changeInput}
      >
        <Combobox.Label>Select companies</Combobox.Label>
        <Combobox.Control>
          <Combobox.Input />
        </Combobox.Control>
        <Combobox.Content>
          <Combobox.List>
            <For each={collection().items}>
              {
                /** Keep each rendered company attached to its collection item. */
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
      </Combobox.Root>
    </Box>
  );
}

/** Compare replace, clear, and preserve selection behavior in one story. */
export function ComboboxSelectionBehaviorExample(): JSX.Element {
  return (
    <Stack gap="8" style={{ padding: 'var(--leverui-spacing-4)' }}>
      <ComboboxSelectionDemo behavior="replace" />
      <ComboboxSelectionDemo behavior="clear" />
      <ComboboxSelectionDemo behavior="preserve" />
    </Stack>
  );
}
