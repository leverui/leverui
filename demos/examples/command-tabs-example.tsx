import { createMemo, createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { SearchIcon } from '@lucide/solid';
import {
  Box,
  Button,
  Command,
  HStack,
  Kbd,
  Portal,
  Span,
  Tabs,
  useCommandCollection,
} from '../../src';
import { items, type Item } from './command-tabs-data';
import './command-tabs-example.css';

const tabs = [
  { label: 'All', value: 'all' },
  { label: 'Apps', value: 'apps' },
  { label: 'Actions', value: 'actions' },
  { label: 'People', value: 'people' },
];

/** Scope Command's searchable items with the hosted category tabs. */
export function CommandTabsExample(): JSX.Element {
  const [tab, setTab] = createSignal('all');
  const scopedItems = createMemo(
    /** Keep the full list only for the All tab. */
    () => (tab() === 'all' ? items : items.filter((item) => item.category === tab())),
  );
  const command = useCommandCollection<Item>(
    /** Rebuild ranking when the selected tab changes. */
    () => ({ initialItems: scopedItems() }),
  );

  return (
    <Command.Provider value={command}>
      <Command.Dialog
        onExitComplete={
          /** Return to the All tab after the exit animation. */
          () => setTab('all')
        }
      >
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
                <SearchIcon /> Search apps, actions and people...
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
                <Command.Input placeholder="Search apps, actions and people..." />
              </Command.Control>
              <Box class="command-tabs-category">
                <Tabs.Root
                  value={tab()}
                  onValueChange={
                    /** Scope the results to the selected tab. */
                    (details) => setTab(details.value ?? 'all')
                  }
                  size="sm"
                  variant="subtle"
                >
                  <Tabs.List class="command-tabs-list">
                    <For each={tabs}>
                      {
                        /** Render one tab for each search category. */
                        (item) => <Tabs.Trigger value={item.value}>{item.label}</Tabs.Trigger>
                      }
                    </For>
                  </Tabs.List>
                </Tabs.Root>
              </Box>
              <Command.List>
                <For each={command().collection.items}>
                  {
                    /** Display each scoped result with its description. */
                    (item) => (
                      <Command.Item item={item}>
                        <item.icon />
                        <Command.ItemText highlight>{item.label}</Command.ItemText>
                        <Span textStyle="xs" class="command-tabs-description">
                          {item.description}
                        </Span>
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
