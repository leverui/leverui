import { createSignal, For, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  FolderIcon,
  MoonIcon,
  RefreshCwIcon,
  SearchIcon,
  SettingsIcon,
  TrashIcon,
  UserPlusIcon,
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
  group: string;
  icon: Component;
}

const items: Item[] = [
  { label: 'Create new project', value: 'new-project', group: 'Projects', icon: FolderIcon },
  { label: 'Delete project', value: 'delete-project', group: 'Projects', icon: TrashIcon },
  { label: 'Invite teammate', value: 'invite', group: 'Projects', icon: UserPlusIcon },
  { label: 'Switch theme', value: 'theme', group: 'Preferences', icon: MoonIcon },
  { label: 'Open settings', value: 'settings', group: 'Preferences', icon: SettingsIcon },
  {
    label: 'Sync settings',
    value: 'sync-settings',
    group: 'Preferences',
    icon: RefreshCwIcon,
  },
];

/** Let both the trigger and suggestion buttons control Command's query. */
export function CommandControlledSearchExample(): JSX.Element {
  const [query, setQuery] = createSignal('');
  const command = useCommandCollection<Item>(
    /** Keep the collection in sync with the controlled query signal. */
    () => ({
      initialItems: items,
      /** Group visible actions under their headings. */
      groupBy: (item) => item.group,
      query: query(),
      onQueryChange: setQuery,
    }),
  );

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
                    'min-width': 'var(--lui-spacing-64)',
                    'justify-content': 'flex-start',
                    color: 'var(--lui-colors-fg-muted)',
                  }}
                >
                  <SearchIcon /> {query() || 'Search commands...'}
                </Button>
              )
            }
          />
          <Portal>
            <Command.DialogBackdrop />
            <Command.DialogContent>
              <Command.Root>
                <Command.Control>
                  <Command.Indicator />
                  <Command.Input placeholder="Type a command or search..." />
                </Command.Control>
                <Command.List>
                  <For each={command().collection.group()}>
                    {
                      /** Render the Projects and Preferences groups. */
                      ([group, items]) => (
                        <Command.ItemGroup>
                          <Command.ItemGroupLabel>{group}</Command.ItemGroupLabel>
                          <For each={items}>
                            {
                              /** Show each filtered action with its icon. */
                              (item) => (
                                <Command.Item item={item}>
                                  <item.icon />
                                  <Command.ItemText highlight>{item.label}</Command.ItemText>
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
      <HStack gap="2" wrap="wrap" style={{ 'margin-top': 'var(--lui-spacing-4)' }}>
        <Text
          textStyle="sm"
          style={{
            color: 'var(--lui-colors-fg-muted)',
          }}
        >
          Try
        </Text>
        <For each={['theme', 'project', 'settings']}>
          {
            /** Apply a suggested search without opening the palette. */
            (term) => (
              <Button size="xs" variant="subtle" onClick={() => setQuery(term)}>
                {term}
              </Button>
            )
          }
        </For>
      </HStack>
      <Text
        textStyle="sm"
        style={{
          'margin-top': 'var(--lui-spacing-2)',
          color: 'var(--lui-colors-fg-muted)',
        }}
      >
        Query: <Span style={{ color: 'var(--lui-colors-fg)' }}>{query() || 'empty'}</Span>
      </Text>
    </>
  );
}
