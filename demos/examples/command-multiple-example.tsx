import { createSignal, For, Show, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  AccessibilityIcon,
  BookIcon,
  BugIcon,
  CheckIcon,
  FlowerIcon,
  GaugeIcon,
  PaletteIcon,
  SparklesIcon,
  TagIcon,
  TriangleAlertIcon,
} from '@lucide/solid';
import {
  Badge,
  Box,
  Button,
  Command,
  HStack,
  Kbd,
  Portal,
  Text,
  Wrap,
  useCommandCollection,
  type CommandItem,
} from '../../src';

interface Item extends CommandItem {
  value: string;
  label: string;
  icon: Component;
}

const items: Item[] = [
  { label: 'Bug', value: 'bug', icon: BugIcon },
  { label: 'Feature', value: 'feature', icon: SparklesIcon },
  { label: 'Documentation', value: 'docs', icon: BookIcon },
  { label: 'Design', value: 'design', icon: PaletteIcon },
  { label: 'Performance', value: 'performance', icon: GaugeIcon },
  { label: 'Accessibility', value: 'a11y', icon: AccessibilityIcon },
  { label: 'Breaking change', value: 'breaking', icon: TriangleAlertIcon },
  { label: 'Good first issue', value: 'good-first-issue', icon: FlowerIcon },
];

/** Toggle labels in place while keeping the Command dialog open. */
export function CommandMultipleExample(): JSX.Element {
  const [values, setValues] = createSignal(['bug', 'a11y']);
  const command = useCommandCollection<Item>({ initialItems: items });
  /** Keep the selected labels in source order for the badge row. */
  const selected = () => items.filter((item) => values().includes(item.value));

  return (
    <>
      <Command.Provider value={command}>
        <Command.Dialog>
          <Command.DialogTrigger
            asChild={
              /** Keep trigger behavior on the outline button. */
              (getProps) => (
                <Button
                  {...getProps()}
                  variant="outline"
                  size="sm"
                  style={{
                    'min-width': 'var(--leverui-spacing-64)',
                    'justify-content': 'flex-start',
                    color: 'var(--leverui-colors-fg-muted)',
                  }}
                >
                  <TagIcon /> Add labels...
                </Button>
              )
            }
          />
          <Portal>
            <Command.DialogBackdrop />
            <Command.DialogContent>
              <Command.Root
                closeOnSelect={false}
                onSelect={
                  /** Add or remove the selected label. */
                  (details) =>
                    setValues(
                      /** Remove the label when selected, otherwise add it. */
                      (current) =>
                        current.includes(details.itemValue)
                          ? current.filter((value) => value !== details.itemValue)
                          : [...current, details.itemValue],
                    )
                }
              >
                <Command.Control>
                  <Command.Indicator />
                  <Command.Input placeholder="Search labels..." />
                </Command.Control>
                <Command.List>
                  <For each={command().collection.items}>
                    {
                      /** Mark selected labels in the current filtered list. */
                      (item) => (
                        <Command.Item item={item}>
                          <item.icon />
                          <Command.ItemText highlight>{item.label}</Command.ItemText>
                          <Show when={values().includes(item.value)}>
                            <Box
                              style={{
                                color: 'var(--leverui-colors-fg)',
                                'margin-inline-start': 'auto',
                              }}
                            >
                              <CheckIcon />
                            </Box>
                          </Show>
                        </Command.Item>
                      )
                    }
                  </For>
                  <Command.Empty>No labels found</Command.Empty>
                </Command.List>
                <Command.Footer>
                  <HStack gap="1.5">
                    <HStack gap="0.5">
                      <Kbd size="sm" variant="subtle">
                        ↑
                      </Kbd>
                      <Kbd size="sm" variant="subtle">
                        ↓
                      </Kbd>
                    </HStack>
                    Navigate
                  </HStack>
                  <HStack gap="1.5">
                    <Kbd size="sm" variant="subtle">
                      ↵
                    </Kbd>
                    Toggle
                  </HStack>
                  <HStack gap="1.5">
                    <Kbd size="sm" variant="subtle">
                      esc
                    </Kbd>
                    Close
                  </HStack>
                </Command.Footer>
              </Command.Root>
            </Command.DialogContent>
          </Portal>
        </Command.Dialog>
      </Command.Provider>
      <Show
        when={selected().length > 0}
        fallback={
          <Text
            textStyle="sm"
            style={{
              'margin-top': 'var(--leverui-spacing-4)',
              color: 'var(--leverui-colors-fg-muted)',
            }}
          >
            No labels selected
          </Text>
        }
      >
        <Wrap style={{ 'margin-top': 'var(--leverui-spacing-4)' }} gap="1.5">
          <For each={selected()}>
            {
              /** Display one surface badge for each selected label. */
              (item) => (
                <Badge variant="surface" size="md">
                  <item.icon />
                  {item.label}
                </Badge>
              )
            }
          </For>
        </Wrap>
      </Show>
    </>
  );
}
