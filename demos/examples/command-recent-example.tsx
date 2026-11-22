import { createMemo, createSignal, For, onSettled } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { SearchIcon } from '@lucide/solid';
import { Button, Command, HStack, Kbd, Portal, useCommandCollection } from '../../src';
import { items, type Item } from './command-recent-data';

const storageKey = 'leverui-command-recent';

/** Show recent actions above the full list while the query is empty. */
export function CommandRecentExample(): JSX.Element {
  const [recent, setRecent] = createSignal<string[]>([]);
  const [searching, setSearching] = createSignal(false);
  const visibleItems = createMemo(
    /** Copy stored actions into the Recent group while the query is empty. */
    () => {
      if (searching()) return items;
      const previous = recent().flatMap(
        /** Copy one stored action into the Recent group when it still exists. */
        (value) => {
          const item = items.find((candidate) => candidate.value === value);
          return item ? [{ ...item, value: `recent:${item.value}`, group: 'Recent' }] : [];
        },
      );
      return [...previous, ...items];
    },
  );
  const command = useCommandCollection<Item>(
    /** Follow both stored history and the current search mode. */
    () => ({
      initialItems: visibleItems(),
      /** Keep the Recent and Commands sections separate. */
      groupBy: (item) => item.group,
    }),
  );

  onSettled(
    /** Load valid stored actions once browser storage is available. */
    () => {
      try {
        const stored: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
        if (!Array.isArray(stored)) return;
        const values = stored.filter(
          /** Keep only stored values that name a current action. */
          (value): value is string =>
            typeof value === 'string' && items.some((item) => item.value === value),
        );
        setRecent(values.slice(0, 3));
      } catch {
        // Storage can be unavailable in private or restricted contexts.
      }
    },
  );

  /** Save the selected action at the front of the recent list. */
  function remember(value: string): void {
    const normalized = value.replace(/^recent:/, '');
    const next = [normalized, ...recent().filter((entry) => entry !== normalized)].slice(0, 3);
    setRecent(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Storage can be unavailable in private or restricted contexts.
    }
  }

  return (
    <Command.Provider value={command}>
      <Command.Dialog
        onExitComplete={
          /** Restore the recent group when the dialog exits. */
          () => setSearching(false)
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
                <SearchIcon /> Search commands...
              </Button>
            )
          }
        />
        <Portal>
          <Command.DialogBackdrop />
          <Command.DialogContent>
            <Command.Root
              onInputValueChange={
                /** Show the recent group only when the input is empty. */
                (details) => setSearching(details.inputValue !== '')
              }
              onSelect={
                /** Remember a selection whether or not it came from Recent. */
                (details) => remember(details.itemValue)
              }
            >
              <Command.Control>
                <Command.Indicator />
                <Command.Input placeholder="Type a command or search..." />
              </Command.Control>
              <Command.List>
                <For each={command().collection.group()}>
                  {
                    /** Render recent results before the Commands group. */
                    ([group, items]) => (
                      <Command.ItemGroup>
                        <Command.ItemGroupLabel>{group}</Command.ItemGroupLabel>
                        <For each={items}>
                          {
                            /** Keep each shortcut next to its action. */
                            (item) => (
                              <Command.Item item={item}>
                                <item.icon />
                                <Command.ItemText highlight>{item.label}</Command.ItemText>
                                <For each={item.shortcut}>
                                  {
                                    /** Draw every key in the action shortcut. */
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
