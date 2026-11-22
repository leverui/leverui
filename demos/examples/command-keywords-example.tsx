import { For, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  GitPullRequestIcon,
  RocketIcon,
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
  Stack,
  Text,
  useCommandCollection,
  type CommandItem,
} from '../../src';

interface Item extends CommandItem {
  value: string;
  label: string;
  group: string;
  description: string;
  keywords: string[];
  icon: Component;
  shortcut?: string[];
}

const items: Item[] = [
  {
    label: 'Open settings',
    value: 'settings',
    group: 'Workspace',
    description: 'Configure your editor and account',
    keywords: ['preferences', 'config'],
    icon: SettingsIcon,
    shortcut: ['⌘', ','],
  },
  {
    label: 'Toggle terminal',
    value: 'terminal',
    group: 'Workspace',
    description: 'Show or hide the integrated terminal',
    keywords: ['shell', 'console'],
    icon: TerminalIcon,
    shortcut: ['⌃', '`'],
  },
  {
    label: 'Create pull request',
    value: 'create-pr',
    group: 'Git',
    description: 'Open a pull request from this branch',
    keywords: ['PR', 'merge request', 'review'],
    icon: GitPullRequestIcon,
  },
  {
    label: 'Deploy preview',
    value: 'deploy-preview',
    group: 'Git',
    description: 'Publish a shareable preview build',
    keywords: ['ship', 'release', 'publish'],
    icon: RocketIcon,
  },
];

/** Search workspace actions by label or aliases in the hosted example. */
export function CommandKeywordsExample(): JSX.Element {
  const command = useCommandCollection<Item>({
    initialItems: items,
    /** Keep Workspace and Git as separate result sections. */
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
                <SearchIcon /> Search workspace...
              </Button>
            )
          }
        />
        <Portal>
          <Command.DialogBackdrop />
          <Command.DialogContent>
            <Command.Root>
              <Command.Label>Workspace commands</Command.Label>
              <Command.Control>
                <Command.Indicator />
                <Command.Input placeholder="Try ‘preferences’, ‘deploy’, or ‘PR’..." />
              </Command.Control>
              <Command.List>
                <For each={command().collection.group()}>
                  {
                    /** Render each filtered group in source order. */
                    ([group, items]) => (
                      <Command.ItemGroup>
                        <Command.ItemGroupLabel>{group}</Command.ItemGroupLabel>
                        <For each={items}>
                          {
                            /** Pair each command label with its descriptive subline. */
                            (item) => (
                              <Command.Item item={item}>
                                <item.icon />
                                <Stack gap="0" style={{ flex: '1', 'min-width': '0' }}>
                                  <Command.ItemText highlight>{item.label}</Command.ItemText>
                                  <Text
                                    truncate
                                    textStyle="xs"
                                    style={{
                                      color: 'var(--leverui-colors-fg-muted)',
                                    }}
                                  >
                                    {item.description}
                                  </Text>
                                </Stack>
                                <For each={item.shortcut}>
                                  {
                                    /** Show each shortcut hint beside its action. */
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
                <Command.Empty>No matching commands or aliases</Command.Empty>
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
