import { createSignal, For, Show, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  CopyIcon,
  FilePlusIcon,
  FolderOpenIcon,
  SaveIcon,
  SearchIcon,
  SettingsIcon,
  TerminalIcon,
} from '@lucide/solid';
import {
  Button,
  Command,
  HStack,
  Kbd,
  Portal,
  Span,
  Text,
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
  { label: 'Copy path', value: 'copy-path', icon: CopyIcon, shortcut: ['⌥', '⌘', 'C'] },
  { label: 'Search in files', value: 'search', icon: SearchIcon, shortcut: ['⇧', '⌘', 'F'] },
  { label: 'Toggle terminal', value: 'terminal', icon: TerminalIcon, shortcut: ['⌃', '`'] },
  { label: 'Open settings', value: 'settings', icon: SettingsIcon, shortcut: ['⌘', ','] },
];

/** Show the hosted Command dialog with actions and footer keyboard hints. */
export function CommandBasicExample(): JSX.Element {
  const [lastCommand, setLastCommand] = createSignal<string>();
  const command = useCommandCollection<Item>({ initialItems: items });

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
                  <SearchIcon /> Search commands...
                </Button>
              )
            }
          />
          <Portal>
            <Command.DialogBackdrop />
            <Command.DialogContent>
              <Command.Root
                onSelect={
                  /** Report the selected command after its item action runs. */
                  (details) => setLastCommand(command().collection.find(details.itemValue)?.label)
                }
              >
                <Command.Control>
                  <Command.Indicator />
                  <Command.Input placeholder="Type a command or search..." />
                </Command.Control>
                <Command.List>
                  <For each={command().collection.items}>
                    {
                      /** Render every current ranked action. */
                      (item) => (
                        <Command.Item item={item}>
                          <item.icon />
                          <Command.ItemText highlight>{item.label}</Command.ItemText>
                          <For each={item.shortcut}>
                            {
                              /** Show each shortcut key. */
                              (key) => <Command.ItemCommand>{key}</Command.ItemCommand>
                            }
                          </For>
                        </Command.Item>
                      )
                    }
                  </For>
                  <Command.Empty>No commands found</Command.Empty>
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
                    Run
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
      <Show when={lastCommand()}>
        <Text
          textStyle="sm"
          style={{
            'margin-top': 'var(--leverui-spacing-4)',
            color: 'var(--leverui-colors-fg-muted)',
          }}
        >
          Ran <Span style={{ color: 'var(--leverui-colors-fg)' }}>{lastCommand()}</Span>
        </Text>
      </Show>
    </>
  );
}
