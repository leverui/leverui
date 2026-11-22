import { For, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  ArchiveIcon,
  ContrastIcon,
  CopyIcon,
  FileIcon,
  FolderIcon,
  InboxIcon,
  LinkIcon,
  ListIcon,
  MoonIcon,
  PanelLeftIcon,
  SearchIcon,
  UserIcon,
} from '@lucide/solid';
import {
  Button,
  Command,
  HStack,
  Kbd,
  Portal,
  useCommandCollection,
  type CommandItem,
} from '../../src';

interface Item extends CommandItem {
  value: string;
  label: string;
  group: string;
  icon: Component;
  shortcut?: string[];
}

const items: Item[] = [
  {
    label: 'Create issue',
    value: 'create-issue',
    group: 'Issues',
    icon: FileIcon,
    shortcut: ['C'],
  },
  {
    label: 'Change status',
    value: 'change-status',
    group: 'Issues',
    icon: ContrastIcon,
    shortcut: ['S'],
  },
  { label: 'Assign to...', value: 'assign', group: 'Issues', icon: UserIcon, shortcut: ['A'] },
  {
    label: 'Copy issue link',
    value: 'copy-link',
    group: 'Issues',
    icon: LinkIcon,
    shortcut: ['⌘', '⇧', ','],
  },
  { label: 'Archive issue', value: 'archive', group: 'Issues', icon: ArchiveIcon },
  {
    label: 'Go to inbox',
    value: 'inbox',
    group: 'Navigation',
    icon: InboxIcon,
    shortcut: ['G', 'I'],
  },
  {
    label: 'Go to my issues',
    value: 'my-issues',
    group: 'Navigation',
    icon: ListIcon,
    shortcut: ['G', 'M'],
  },
  {
    label: 'Go to projects',
    value: 'projects',
    group: 'Navigation',
    icon: FolderIcon,
    shortcut: ['G', 'P'],
  },
  {
    label: 'Toggle sidebar',
    value: 'sidebar',
    group: 'View',
    icon: PanelLeftIcon,
    shortcut: ['⌘', 'B'],
  },
  { label: 'Duplicate view', value: 'duplicate-view', group: 'View', icon: CopyIcon },
  {
    label: 'Switch theme',
    value: 'theme',
    group: 'View',
    icon: MoonIcon,
    shortcut: ['⌘', '⇧', 'L'],
  },
];

/** Display the hosted grouped command palette with its eleven actions. */
export function CommandGroupsExample(): JSX.Element {
  const command = useCommandCollection<Item>({
    initialItems: items,
    /** Preserve the Issues, Navigation, and View sections. */
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
                  'min-width': 'var(--leverui-spacing-64)',
                  'justify-content': 'flex-start',
                  color: 'var(--leverui-colors-fg-muted)',
                }}
              >
                <SearchIcon /> Search...
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
                    /** Render each section from the current filtered collection. */
                    ([group, items]) => (
                      <Command.ItemGroup>
                        <Command.ItemGroupLabel>{group}</Command.ItemGroupLabel>
                        <For each={items}>
                          {
                            /** Show the action text, icon, and shortcut. */
                            (item) => (
                              <Command.Item item={item}>
                                <item.icon />
                                <Command.ItemText highlight>{item.label}</Command.ItemText>
                                <For each={item.shortcut}>
                                  {
                                    /** Draw each shortcut key separately. */
                                    (key) => <Command.ItemCommand>{key}</Command.ItemCommand>
                                  }
                                </For>
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
  );
}
