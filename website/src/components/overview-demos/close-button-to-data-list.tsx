import {
  Box,
  CloseButton,
  Code,
  CodeBlock,
  Collapsible,
  ColorPicker,
  ColorSwatch,
  Combobox,
  Command,
  Container,
  DataList,
  HStack,
  Stack,
  Text,
  useCommandCollection,
  useListCollection,
} from '../../../../src';
import { For, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { PopupSurface } from './shared';

const muted = 'var(--lui-colors-gray-muted)';
const tint = 'var(--overview-tint)';
const actions = [
  { label: 'New file', value: 'new-file' },
  { label: 'Open settings', value: 'settings' },
];
const details = [
  { label: 'Name', value: 'Iris Calder' },
  { label: 'Role', value: 'Designer' },
  { label: 'Team', value: 'Growth' },
];

/** The close button in three styles. */
function CloseButtonDemo(): JSX.Element {
  return (
    <HStack gap="3">
      <CloseButton size="sm" />
      <CloseButton size="sm" variant="outline" />
      <CloseButton size="sm" variant="subtle" />
    </HStack>
  );
}

/** Two lines of code in a block. */
function CodeBlockDemo(): JSX.Element {
  const code = 'const total = price * count;\nconsole.log(total);';
  return (
    <CodeBlock.Root code={code} language="ts" size="sm" style={{ width: '100%' }}>
      <CodeBlock.Content>
        <CodeBlock.Code>
          <CodeBlock.CodeText />
        </CodeBlock.Code>
      </CodeBlock.Content>
    </CodeBlock.Root>
  );
}

/** A short piece of code inside a sentence. */
function CodeDemo(): JSX.Element {
  return (
    <Text textStyle="sm">
      Call <Code>save()</Code> to keep your changes.
    </Text>
  );
}

/** An open section under the heading that toggles it. */
function CollapsibleDemo(): JSX.Element {
  return (
    <Collapsible.Root defaultOpen style={{ width: '100%' }}>
      <Collapsible.Trigger>
        <HStack gap="2">
          <i class="bi bi-chevron-down" aria-hidden="true" /> Shipping details
        </HStack>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Box style={{ 'margin-top': '8px', padding: '8px 12px', background: muted }}>
          Arrives in two days.
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

/** The field and swatch that open the color picker. */
function ColorPickerDemo(): JSX.Element {
  return (
    <ColorPicker.Root defaultValue={ColorPicker.parseColor('#0891b2')} size="sm">
      <ColorPicker.Control>
        <ColorPicker.Input />
        <ColorPicker.Trigger />
      </ColorPicker.Control>
    </ColorPicker.Root>
  );
}

/** Four color samples in a row. */
function ColorSwatchDemo(): JSX.Element {
  return (
    <HStack gap="2">
      <For each={['#0891b2', '#2563eb', '#f97316', '#9333ea']}>
        {/** One sample of a color. */}
        {(color) => <ColorSwatch value={color} size="lg" />}
      </For>
    </HStack>
  );
}

/** A search field over a picture of its open list of matches. */
function ComboboxDemo(): JSX.Element {
  const { collection } = useListCollection({ initialItems: ['Mara Ellison', 'Theo Park'] });
  return (
    <Stack gap="1" style={{ width: '100%' }}>
      <Combobox.Root collection={collection()} size="sm">
        <Combobox.Control>
          <Combobox.Input placeholder="Search people" />
          <Combobox.IndicatorGroup>
            <Combobox.Trigger />
          </Combobox.IndicatorGroup>
        </Combobox.Control>
      </Combobox.Root>
      <PopupSurface>
        <Stack gap="1">
          <Text textStyle="sm">Mara Ellison</Text>
          <Text textStyle="sm">Theo Park</Text>
        </Stack>
      </PopupSurface>
    </Stack>
  );
}

/** A search box above two actions to run. */
function CommandDemo(): JSX.Element {
  const command = useCommandCollection({ initialItems: actions });
  return (
    <Command.Root command={command} size="sm" style={{ width: '100%' }}>
      <Command.Control>
        <Command.Indicator />
        <Command.Input placeholder="Type a command" />
      </Command.Control>
      <Command.List>
        <For each={command().collection.items}>
          {/** One action in the list. */}
          {(item) => (
            <Command.Item item={item}>
              <Command.ItemText>{item.label}</Command.ItemText>
            </Command.Item>
          )}
        </For>
      </Command.List>
    </Command.Root>
  );
}

/** A narrow column centered in a wider page. */
function ContainerDemo(): JSX.Element {
  return (
    <Box style={{ width: '100%', padding: '12px 0', background: muted }}>
      <Container style={{ '--lui-container-max-width': '150px' }}>
        <Stack gap="2">
          <Box style={{ height: '16px', background: tint }} />
          <Box style={{ height: '32px', background: tint }} />
        </Stack>
      </Container>
    </Box>
  );
}

/** Three labels with their values. */
function DataListDemo(): JSX.Element {
  return (
    <DataList.Root orientation="horizontal" size="sm">
      <For each={details}>
        {/** One label and its value. */}
        {(item) => (
          <DataList.Item>
            <DataList.ItemLabel>{item.label}</DataList.ItemLabel>
            <DataList.ItemValue>{item.value}</DataList.ItemValue>
          </DataList.Item>
        )}
      </For>
    </DataList.Root>
  );
}

/** The overview demos for close-button through data-list, by guide slug. */
export const demos: Readonly<Record<string, Component>> = {
  'close-button': CloseButtonDemo,
  'code-block': CodeBlockDemo,
  code: CodeDemo,
  collapsible: CollapsibleDemo,
  'color-picker': ColorPickerDemo,
  'color-swatch': ColorSwatchDemo,
  combobox: ComboboxDemo,
  command: CommandDemo,
  container: ContainerDemo,
  'data-list': DataListDemo,
};
