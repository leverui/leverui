import { For, type Component } from 'solid-js';
import { type JSX } from '@solidjs/web';
import {
  CalculatorIcon,
  CalendarIcon,
  CreditCardIcon,
  FaceSlightlySmilingIcon,
  SettingsIcon,
  UserIcon,
} from '@lucide/solid';
import { Command, useCommandCollection, type CommandItem } from '../../src';

interface Item extends CommandItem {
  value: string;
  label: string;
  group: string;
  icon: Component;
  shortcut?: string[];
}

const items: Item[] = [
  { label: 'Calendar', value: 'calendar', group: 'Suggestions', icon: CalendarIcon },
  { label: 'Search emoji', value: 'emoji', group: 'Suggestions', icon: FaceSlightlySmilingIcon },
  { label: 'Calculator', value: 'calculator', group: 'Suggestions', icon: CalculatorIcon },
  {
    label: 'Profile',
    value: 'profile',
    group: 'Settings',
    icon: UserIcon,
    shortcut: ['⌘', 'P'],
  },
  {
    label: 'Billing',
    value: 'billing',
    group: 'Settings',
    icon: CreditCardIcon,
    shortcut: ['⌘', 'B'],
  },
  {
    label: 'Settings',
    value: 'settings',
    group: 'Settings',
    icon: SettingsIcon,
    shortcut: ['⌘', ','],
  },
];

/** Match the hosted Command inline palette with Solid search and groups. */
export function CommandInlineExample(): JSX.Element {
  const command = useCommandCollection<Item>({
    initialItems: items,
    /** Keep the suggestion and settings groups. */
    groupBy: (item) => item.group,
  });

  return (
    <Command.Root
      command={command}
      style={{
        'max-width': '24rem',
        'border-width': '1px',
        'border-style': 'solid',
        'box-shadow': 'var(--leverui-shadows-xs)',
      }}
    >
      <Command.Label>Search commands</Command.Label>
      <Command.Control>
        <Command.Indicator />
        <Command.Input placeholder="Type a command or search..." />
      </Command.Control>
      <Command.List>
        <For each={command().collection.group()}>
          {
            /** Render each group against the same ranked collection. */
            ([group, items]) => (
              <Command.ItemGroup>
                <Command.ItemGroupLabel>{group}</Command.ItemGroupLabel>
                <For each={items}>
                  {
                    /** Render one item per ranked collection value. */
                    (item) => (
                      <Command.Item item={item}>
                        <item.icon />
                        <Command.ItemText highlight>{item.label}</Command.ItemText>
                        <For each={item.shortcut}>
                          {
                            /** Show each key in a multi-key shortcut. */
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
    </Command.Root>
  );
}
