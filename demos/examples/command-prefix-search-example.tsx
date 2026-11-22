import { createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { SearchIcon } from '@lucide/solid';
import { Dynamic } from '@solidjs/web';
import { Badge, Button, Command, HStack, Kbd, Portal, useCommandCollection } from '../../src';
import { allItems, scopes, type Item } from './command-prefix-data';

/** Switch between hosted Command, People, and Projects search scopes. */
export function CommandPrefixSearchExample(): JSX.Element {
  const [prefix, setPrefix] = createSignal<'>' | '@' | '#' | null>(null);
  /** Read the active scope without freezing its signal. */
  const scope = () => {
    const key = prefix();
    return key ? scopes[key] : null;
  };
  const command = useCommandCollection<Item>(
    /** Restrict the searchable collection to the active scope. */
    () => ({
      initialItems: scope()?.items ?? allItems,
      /** Keep source categories as separate sections before filtering. */
      groupBy: (item) => item.group,
    }),
  );

  /** Turn a leading scope key into a chip or clear the chip with Backspace. */
  function handleInputKeyDown(event: KeyboardEvent): void {
    if (command().query) return;
    const active = prefix();
    const key = (['>', '@', '#'] as const).find((item) => item === event.key);
    if (!active && key) {
      event.preventDefault();
      setPrefix(key);
    } else if (active && event.key === 'Backspace') {
      event.preventDefault();
      setPrefix(null);
    }
  }

  return (
    <Command.Provider value={command}>
      <Command.Dialog
        onExitComplete={
          /** Restore unscoped search after the dialog closes. */
          () => setPrefix(null)
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
                <SearchIcon /> Search everything...
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
                <Show when={scope()}>
                  {
                    /** Name the current scope before the editable query. */
                    (current) => (
                      <Badge size="sm" variant="surface" style={{ 'flex-shrink': '0' }}>
                        <Dynamic component={current().icon} />
                        {current().label}
                      </Badge>
                    )
                  }
                </Show>
                <Command.Input
                  placeholder={
                    scope()
                      ? `Search ${scope()?.label.toLowerCase()}...`
                      : 'Search or type > @ # to filter...'
                  }
                  onKeyDown={handleInputKeyDown}
                />
              </Command.Control>
              <Command.List>
                <For each={command().collection.group()}>
                  {
                    /** Render each visible scope section. */
                    ([group, items]) => (
                      <Command.ItemGroup>
                        <Command.ItemGroupLabel>{group}</Command.ItemGroupLabel>
                        <For each={items}>
                          {
                            /** Show one result and its scope-specific icon. */
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
                  <Kbd size="sm" variant="subtle">
                    {'>'}
                  </Kbd>
                  Commands
                </HStack>
                <HStack gap="1.5">
                  <Kbd size="sm" variant="subtle">
                    @
                  </Kbd>
                  People
                </HStack>
                <HStack gap="1.5">
                  <Kbd size="sm" variant="subtle">
                    #
                  </Kbd>
                  Projects
                </HStack>
              </Command.Footer>
            </Command.Root>
          </Command.DialogContent>
        </Portal>
      </Command.Dialog>
    </Command.Provider>
  );
}
