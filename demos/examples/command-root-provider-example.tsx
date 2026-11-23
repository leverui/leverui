import { createSignal, For, onSettled, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
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
  useCommand,
  useCommandCollection,
  type CommandItem,
} from '../../src';

interface Item extends CommandItem {
  label: string;
  value: string;
  icon: Component;
  shortcut: string[];
}

const items: Item[] = [
  { label: 'New file', value: 'new-file', icon: FilePlusIcon, shortcut: ['⌘', 'N'] },
  { label: 'Open file', value: 'open-file', icon: FolderOpenIcon, shortcut: ['⌘', 'O'] },
  { label: 'Save file', value: 'save-file', icon: SaveIcon, shortcut: ['⌘', 'S'] },
  { label: 'Search in files', value: 'search', icon: SearchIcon, shortcut: ['⇧', '⌘', 'F'] },
  { label: 'Toggle terminal', value: 'terminal', icon: TerminalIcon, shortcut: ['⌃', '`'] },
  { label: 'Open settings', value: 'settings', icon: SettingsIcon, shortcut: ['⌘', ','] },
];

/** Demonstrate a caller-owned Command machine and a global menu shortcut. */
export function CommandRootProviderExample(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const command = useCommandCollection<Item>({ initialItems: items });
  const store = useCommand<Item>({
    command,
    /** Close the controlled dialog after an action runs. */
    onClose: () => setOpen(false),
  });

  /** Toggle the dialog when the user presses the platform command key and K. */
  function handleShortcut(event: KeyboardEvent): void {
    if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return;
    event.preventDefault();
    setOpen((current) => !current);
  }

  onSettled(
    /** Listen for the shortcut in the browser, and stop when the example unmounts. */
    () => {
      document.addEventListener('keydown', handleShortcut);
      return (
        /** Remove the shortcut listener. */
        () => document.removeEventListener('keydown', handleShortcut)
      );
    },
  );

  return (
    <HStack gap="4" wrap="wrap">
      <Button
        variant="outline"
        size="sm"
        style={{
          'min-width': 'var(--lui-spacing-64)',
          'justify-content': 'flex-start',
          color: 'var(--lui-colors-fg-muted)',
        }}
        onClick={() => setOpen(true)}
      >
        <SearchIcon /> Search commands...
        <HStack gap="1" style={{ 'margin-inline-start': 'auto' }}>
          <Kbd size="sm" variant="subtle">
            ⌘
          </Kbd>
          <Kbd size="sm" variant="subtle">
            K
          </Kbd>
        </HStack>
      </Button>
      <Text
        textStyle="sm"
        style={{
          color: 'var(--lui-colors-fg-muted)',
        }}
      >
        Last search:{' '}
        <Span style={{ color: 'var(--lui-colors-fg)' }}>
          {store.combobox().inputValue || 'None'}
        </Span>
      </Text>

      <Command.Provider value={command}>
        <Command.Dialog open={open()} onOpenChange={(details) => setOpen(details.open)}>
          <Portal>
            <Command.DialogBackdrop />
            <Command.DialogContent>
              <Command.RootProvider value={store}>
                <Command.Control>
                  <Command.Indicator />
                  <Command.Input placeholder="Type a command or search..." />
                </Command.Control>
                <Command.List>
                  <For each={command().collection.items}>
                    {
                      /** Render each action through the externally owned machine. */
                      (item) => (
                        <Command.Item item={item}>
                          <item.icon />
                          <Command.ItemText highlight>{item.label}</Command.ItemText>
                          <For each={item.shortcut}>
                            {
                              /** Draw each part of the displayed shortcut. */
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
              </Command.RootProvider>
            </Command.DialogContent>
          </Portal>
        </Command.Dialog>
      </Command.Provider>
    </HStack>
  );
}
