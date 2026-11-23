import { createDeferred, createSignal, For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { createVirtualizer } from './create-virtualizer';
import { SearchIcon } from '@lucide/solid';
import { Dynamic } from '@solidjs/web';
import { Button, Command, HStack, Kbd, Portal, Span, useCommandCollection } from '../../src';
import { items, type Item } from './command-virtualized-data';

/** Window 5,000 document actions while keeping search and keyboard navigation. */
export function CommandVirtualizedExample(): JSX.Element {
  const [list, setList] = createSignal<HTMLDivElement>();
  const [query, setQuery] = createSignal('');
  const deferredQuery = createDeferred(query);
  const command = useCommandCollection<Item>(
    /** Keep input immediate while ranking follows a deferred query. */
    () => ({
      initialItems: items,
      query: query(),
      onQueryChange: setQuery,
      filterQuery: deferredQuery(),
    }),
  );
  const virtualizer = createVirtualizer<HTMLDivElement, HTMLDivElement>({
    /** Track the current filtered list rather than all source actions. */
    get count() {
      return command().collection.size;
    },
    /** Scroll inside the Command result list. */
    getScrollElement: () => list() ?? null,
    /** Use a fixed row estimate. */
    estimateSize: () => 36,
    overscan: 10,
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
                <SearchIcon /> Search documents...
              </Button>
            )
          }
        />
        <Portal>
          <Command.DialogBackdrop />
          <Command.DialogContent>
            <Command.Root
              scrollToIndexFn={
                /** Bring a highlighted offscreen result into the virtual window. */
                (details) => virtualizer.scrollToIndex(details.index, { align: 'auto' })
              }
            >
              <Command.Control>
                <Command.Indicator />
                <Command.Input
                  placeholder={`Search ${items.length.toLocaleString()} commands...`}
                />
              </Command.Control>
              <Command.List ref={setList}>
                <div
                  style={{
                    height: `${virtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  <For each={virtualizer.getVirtualItems()}>
                    {
                      /** Mount only items in the current scrolling window. */
                      (virtualItem) => (
                        <Show when={command().collection.items[virtualItem.index]}>
                          {
                            /** Position the option at its full-list offset. */
                            (item) => (
                              <Command.Item
                                item={item()}
                                aria-posinset={virtualItem.index + 1}
                                aria-setsize={command().collection.size}
                                style={{
                                  position: 'absolute',
                                  top: '0',
                                  left: '0',
                                  width: '100%',
                                  height: `${virtualItem.size}px`,
                                  transform: `translateY(${virtualItem.start}px)`,
                                }}
                              >
                                <Dynamic component={item().icon} />
                                <Command.ItemText highlight>{item().label}</Command.ItemText>
                                <Span
                                  textStyle="xs"
                                  style={{
                                    color: 'var(--lui-colors-fg-subtle)',
                                  }}
                                >
                                  {item().folder}
                                </Span>
                              </Command.Item>
                            )
                          }
                        </Show>
                      )
                    }
                  </For>
                </div>
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
                  Select
                </HStack>
                <Span style={{ 'margin-inline-start': 'auto' }}>
                  {command().collection.size.toLocaleString()} results
                </Span>
              </Command.Footer>
            </Command.Root>
          </Command.DialogContent>
        </Portal>
      </Command.Dialog>
    </Command.Provider>
  );
}
