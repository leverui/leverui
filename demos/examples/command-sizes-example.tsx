import { For, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { FilePlusIcon, FolderOpenIcon, SaveIcon, SearchIcon, SettingsIcon } from '@lucide/solid';
import {
  Button,
  Command,
  HStack,
  Kbd,
  Portal,
  Stack,
  useCommandCollection,
  type CommandItem,
} from '../../src';

interface Item extends CommandItem {
  value: string;
  label: string;
  icon: Component;
  shortcut: string[];
}

const items: Item[] = [
  { label: 'New file', value: 'new-file', icon: FilePlusIcon, shortcut: ['⌘', 'N'] },
  { label: 'Open file', value: 'open-file', icon: FolderOpenIcon, shortcut: ['⌘', 'O'] },
  { label: 'Save', value: 'save', icon: SaveIcon, shortcut: ['⌘', 'S'] },
  { label: 'Open settings', value: 'settings', icon: SettingsIcon, shortcut: ['⌘', ','] },
];

/** Show the hosted small, medium, and large Command triggers together. */
export function CommandSizesExample(): JSX.Element {
  return (
    <Stack gap="3" align="flex-start">
      <For each={['sm', 'md', 'lg'] as const}>
        {
          /** Render one independently searchable Command dialog at this size. */
          (size) => {
            const command = useCommandCollection<Item>({ initialItems: items });
            return (
              <Command.Provider value={command}>
                <Command.Dialog size={size}>
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
                          <SearchIcon /> Search... (size={size})
                        </Button>
                      )
                    }
                  />
                  <Portal>
                    <Command.DialogBackdrop />
                    <Command.DialogContent>
                      <Command.Root size={size}>
                        <Command.Label>Command palette</Command.Label>
                        <Command.Control>
                          <Command.Indicator />
                          <Command.Input placeholder="Type a command or search..." />
                        </Command.Control>
                        <Command.List>
                          <For each={command().collection.items}>
                            {
                              /** Present each ranked action at the current size. */
                              (item) => (
                                <Command.Item item={item}>
                                  <item.icon />
                                  <Command.ItemText highlight>{item.label}</Command.ItemText>
                                  <For each={item.shortcut}>
                                    {
                                      /** Keep shortcut keys separate. */
                                      (key) => <Command.ItemCommand>{key}</Command.ItemCommand>
                                    }
                                  </For>
                                </Command.Item>
                              )
                            }
                          </For>
                          <Command.Empty>No results found</Command.Empty>
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
                            Select
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
            );
          }
        }
      </For>
    </Stack>
  );
}
