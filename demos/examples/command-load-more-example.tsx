import { For, Show } from 'solid-js';
import { type JSX } from '@solidjs/web';
import { UsersIcon } from '@lucide/solid';
import {
  Avatar,
  Button,
  Command,
  HStack,
  Kbd,
  Portal,
  Spinner,
  Text,
  useCommandCollection,
} from '../../src';
import { searchPeople, type Person } from './command-people-data';
import { LoadMoreMarker } from './command-load-more-marker';

/** Search people and append more results near the list's end. */
export function CommandLoadMoreExample(): JSX.Element {
  const command = useCommandCollection<Person>({
    /** Search by each person's full name. */
    itemToString: (item) => `${item.firstName} ${item.lastName}`,
    /** Use the record ID as each option's value. */
    itemToValue: (item) => String(item.id),
    /** Request the first page or the next one from the stored cursor. */
    load: async ({ query, signal, cursor }) => {
      if (!query.trim()) return [];
      const skip = Number(cursor ?? 0);
      const page = await searchPeople({ query, limit: 8, skip, signal });
      return { items: page.results, cursor: skip + 8 < page.total ? String(skip + 8) : undefined };
    },
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
                <UsersIcon /> Browse people...
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
                <Command.Input placeholder="Search by name, e.g. Priya or Marcus..." />
                <Show when={command().loading}>
                  <Spinner size="sm" style={{ color: 'var(--leverui-colors-fg-muted)' }} />
                </Show>
              </Command.Control>
              <Command.List>
                <Show when={command().collection.size === 0}>
                  <Command.Loading>Searching people…</Command.Loading>
                </Show>
                <For each={command().collection.items}>
                  {
                    /** Show each loaded person as one option. */
                    (user) => (
                      <Command.Item item={user}>
                        <Avatar.Root size="2xs">
                          <Avatar.Fallback name={`${user.firstName} ${user.lastName}`} />
                        </Avatar.Root>
                        <Command.ItemText highlight>
                          {`${user.firstName} ${user.lastName}`}
                        </Command.ItemText>
                        <Text
                          truncate
                          textStyle="xs"
                          style={{
                            'margin-inline-start': 'auto',
                            color: 'var(--leverui-colors-fg-muted)',
                          }}
                        >
                          {user.title}
                        </Text>
                      </Command.Item>
                    )
                  }
                </For>
                <Show when={command().hasMore}>
                  <LoadMoreMarker
                    loading={command().loading}
                    onVisible={() => command().loadMore()}
                  />
                </Show>
                <Show
                  when={command().error}
                  fallback={
                    <Command.Empty>
                      {command().query ? 'No people found' : 'Start typing to search'}
                    </Command.Empty>
                  }
                >
                  <Text
                    role="alert"
                    textStyle="sm"
                    style={{
                      'padding-inline': 'var(--leverui-spacing-3)',
                      'padding-block': 'var(--leverui-spacing-6)',
                      'text-align': 'center',
                      color: 'var(--leverui-colors-fg-muted)',
                    }}
                  >
                    Search failed.{' '}
                    <Button size="xs" variant="plain" onClick={() => command().reload()}>
                      Try again
                    </Button>
                  </Text>
                </Show>
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
