import { For, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  ArrowRightIcon,
  BookIcon,
  Grid3x3Icon,
  ChartColumnIcon,
  GitBranchIcon,
  LayoutPanelTopIcon,
  PaletteIcon,
  SearchIcon,
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
  href: string;
}

const items: Item[] = [
  {
    value: 'getting-started',
    label: 'Getting started',
    group: 'Documentation',
    icon: BookIcon,
    href: 'https://leverui.com/docs/getting-started',
  },
  {
    value: 'components',
    label: 'Components',
    group: 'Documentation',
    icon: Grid3x3Icon,
    href: 'https://leverui.com/docs/components',
  },
  {
    value: 'theming',
    label: 'Theming',
    group: 'Documentation',
    icon: PaletteIcon,
    href: 'https://leverui.com/docs/theming',
  },
  {
    value: 'charts',
    label: 'Charts',
    group: 'Resources',
    icon: ChartColumnIcon,
    href: 'https://leverui.com/docs/charts',
  },
  {
    value: 'templates',
    label: 'Templates',
    group: 'Resources',
    icon: LayoutPanelTopIcon,
    href: 'https://leverui.com/templates',
  },
  {
    value: 'github',
    label: 'Source repository',
    group: 'Resources',
    icon: GitBranchIcon,
    href: 'https://github.com/leverui/leverui',
  },
];

/** Offer documentation and resource links through the Command palette. */
export function CommandLinksStory(): JSX.Element {
  const command = useCommandCollection<Item>({
    initialItems: items,
    /** Separate documentation from other resources. */
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
                <SearchIcon /> Search documentation...
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
                <Command.Input placeholder="Search documentation..." />
              </Command.Control>
              <Command.List>
                <For each={command().collection.group()}>
                  {
                    /** Display one group of external destinations. */
                    ([group, items]) => (
                      <Command.ItemGroup>
                        <Command.ItemGroupLabel>{group}</Command.ItemGroupLabel>
                        <For each={items}>
                          {
                            /** Render the option as a native anchor. */
                            (item) => (
                              <Command.Item
                                item={item}
                                asChild={
                                  /** Merge option props with link navigation. */
                                  (getProps) => (
                                    <a
                                      {...getProps()}
                                      href={item.href}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <item.icon />
                                      <Command.ItemText highlight>{item.label}</Command.ItemText>
                                      <ArrowRightIcon />
                                    </a>
                                  )
                                }
                              />
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
                  Open
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
