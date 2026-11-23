import { createEffect, createMemo, createSignal, For } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { SearchIcon } from '@lucide/solid';
import {
  Button,
  Command,
  HStack,
  Kbd,
  Portal,
  SegmentGroup,
  Stack,
  Text,
  useCommandCollection,
  useFormatHotkey,
  useHotkeyStore,
  useHotkeys,
} from '../../src';
import { items, type Item } from './command-hotkeys-data';

/** Register scoped shortcuts that also appear in the Command menu. */
export function CommandHotkeysExample(): JSX.Element {
  const [open, setOpen] = createSignal(false);
  const [scope, setScope] = createSignal('inbox');
  const [lastRun, setLastRun] = createSignal<string>();
  const store = useHotkeyStore();
  const formatHotkey = useFormatHotkey();
  const available = createMemo(
    /** Keep general actions and those for the selected view. */
    () => items.filter((item) => !item.scope || item.scope === scope()),
  );
  const command = useCommandCollection<Item>(
    /** Update menu groups as the view scope changes. */
    () => ({
      initialItems: available(),
      /** Group each action under its visible section. */
      groupBy: (item) => item.group,
    }),
  );

  /** Record an action and close the menu. */
  function run(item: Item, via: string): void {
    setLastRun(`${item.label} (${via})`);
    setOpen(false);
  }

  /** Format a key sequence as separate key caps for the current platform. */
  function keysOf(hotkey: string): string[] {
    return hotkey.split('>').flatMap((step) => formatHotkey(step).split(' '));
  }

  createEffect(scope, (current) => void store.setScope(current));
  useHotkeys({
    commands: [
      {
        hotkey: 'mod+k',
        label: 'Open command menu',
        /** Toggle the palette from its platform shortcut. */
        action: () => setOpen((current) => !current),
        options: { enableOnFormTags: true, preventDefault: true },
      },
      ...items.map((item) => ({
        id: item.value,
        hotkey: item.hotkey,
        label: item.label,
        scopes: item.scope ?? '*',
        /** Run this action even when the menu is closed. */
        action: () => run(item, 'shortcut'),
        options: { preventDefault: true },
      })),
    ],
  });

  return (
    <Stack gap="4" align="flex-start">
      <SegmentGroup.Root
        size="sm"
        value={scope()}
        onValueChange={
          /** Switch the hotkey scope with the selected view. */
          (details) => setScope(details.value === 'issue' ? 'issue' : 'inbox')
        }
      >
        <SegmentGroup.Indicator />
        <SegmentGroup.Items
          items={[
            { label: 'Inbox view', value: 'inbox' },
            { label: 'Issue view', value: 'issue' },
          ]}
        />
      </SegmentGroup.Root>
      <Command.Provider value={command}>
        <Command.Dialog open={open()} onOpenChange={(details) => setOpen(details.open)}>
          <Command.DialogTrigger
            asChild={
              /** Keep trigger behavior on the shortcut button. */
              (getProps) => (
                <Button
                  {...getProps()}
                  variant="outline"
                  size="sm"
                  style={{
                    'min-width': 'var(--lui-spacing-64)',
                    'justify-content': 'space-between',
                    color: 'var(--lui-colors-fg-muted)',
                  }}
                >
                  <HStack gap="2">
                    <SearchIcon /> Search actions...
                  </HStack>
                  <HStack gap="0.5">
                    <For each={keysOf('mod+k')}>
                      {(key) => (
                        <Kbd size="sm" variant="subtle">
                          {key}
                        </Kbd>
                      )}
                    </For>
                  </HStack>
                </Button>
              )
            }
          />
          <Portal>
            <Command.DialogBackdrop />
            <Command.DialogContent>
              <Command.Root
                onSelect={
                  /** Run a menu action through the same path as its shortcut. */
                  (details) => {
                    const item = command().collection.find(details.itemValue);
                    if (item) run(item, 'menu');
                  }
                }
              >
                <Command.Control>
                  <Command.Indicator />
                  <Command.Input placeholder="Type a command or search..." />
                </Command.Control>
                <Command.List>
                  <For each={command().collection.group()}>
                    {([group, items]) => (
                      <Command.ItemGroup>
                        <Command.ItemGroupLabel>{group}</Command.ItemGroupLabel>
                        <For each={items}>
                          {(item) => (
                            <Command.Item item={item}>
                              <item.icon />
                              <Command.ItemText highlight>{item.label}</Command.ItemText>
                              <For each={keysOf(item.hotkey)}>
                                {(key) => <Command.ItemCommand>{key}</Command.ItemCommand>}
                              </For>
                            </Command.Item>
                          )}
                        </For>
                      </Command.ItemGroup>
                    )}
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
                  <Text style={{ 'margin-inline-start': 'auto' }}>
                    Shortcuts also work with the menu closed
                  </Text>
                </Command.Footer>
              </Command.Root>
            </Command.DialogContent>
          </Portal>
        </Command.Dialog>
      </Command.Provider>
      <Text
        textStyle="sm"
        style={{
          color: 'var(--lui-colors-fg-muted)',
        }}
      >
        {lastRun() ? `Ran ${lastRun()}` : 'Try G then I, or C, with the menu closed'}
      </Text>
    </Stack>
  );
}
