import { createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { CommandIcon, SearchIcon } from '@lucide/solid';
import {
  Box,
  Button,
  Command,
  HStack,
  Kbd,
  Portal,
  Separator,
  Span,
  useCommandCollection,
} from '../../src';
import { items, type Item } from './command-footer-data';

/** Update the footer action when the highlighted app or command changes. */
export function CommandFooterActionsExample(): JSX.Element {
  const [highlighted, setHighlighted] = createSignal<Item>();
  const command = useCommandCollection<Item>({
    initialItems: items,
    /** Keep Applications and Commands in separate sections. */
    groupBy: (item) => item.group,
  });

  return (
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
                  'min-width': 'var(--lui-spacing-64)',
                  'justify-content': 'flex-start',
                  color: 'var(--lui-colors-fg-muted)',
                }}
              >
                <SearchIcon /> Search apps and commands...
              </Button>
            )
          }
        />
        <Portal>
          <Command.DialogBackdrop />
          <Command.DialogContent>
            <Command.Root
              onHighlightChange={
                /** Look up the highlighted item in the current collection. */
                (details) =>
                  setHighlighted(
                    command().collection.find(details.highlightedValue ?? '') ?? undefined,
                  )
              }
            >
              <Command.Control>
                <Command.Indicator />
                <Command.Input placeholder="Search for apps and commands..." />
              </Command.Control>
              <Command.List>
                <For each={command().collection.group()}>
                  {
                    /** Render the current section after fuzzy ranking. */
                    ([group, items]) => (
                      <Command.ItemGroup>
                        <Command.ItemGroupLabel>{group}</Command.ItemGroupLabel>
                        <For each={items}>
                          {
                            /** Show the action's app icon and content type. */
                            (item) => (
                              <Command.Item item={item}>
                                <item.icon />
                                <Command.ItemText highlight>{item.label}</Command.ItemText>
                                <Span
                                  textStyle="xs"
                                  style={{
                                    color: 'var(--lui-colors-fg-subtle)',
                                  }}
                                >
                                  {item.type}
                                </Span>
                              </Command.Item>
                            )
                          }
                        </For>
                      </Command.ItemGroup>
                    )
                  }
                </For>
                <Command.Empty>No results found</Command.Empty>
              </Command.List>
              <Command.Footer>
                <Box style={{ color: 'var(--lui-colors-fg-muted)', display: 'inline-flex' }}>
                  <CommandIcon />
                </Box>
                <HStack
                  gap="2"
                  style={{ 'margin-inline-start': 'auto', color: 'var(--lui-colors-fg)' }}
                >
                  <Span style={{ 'font-weight': 'var(--lui-font-weights-medium)' }}>
                    {highlighted()?.action ?? 'Open'}
                  </Span>
                  <Kbd size="sm" variant="subtle">
                    ↵
                  </Kbd>
                </HStack>
                <Separator orientation="vertical" style={{ height: 'var(--lui-sizes-4)' }} />
                <HStack gap="2">
                  <Span>Actions</Span>
                  <HStack gap="1">
                    <Kbd size="sm" variant="subtle">
                      ⌘
                    </Kbd>
                    <Kbd size="sm" variant="subtle">
                      K
                    </Kbd>
                  </HStack>
                </HStack>
              </Command.Footer>
            </Command.Root>
          </Command.DialogContent>
        </Portal>
      </Command.Dialog>
    </Command.Provider>
  );
}
